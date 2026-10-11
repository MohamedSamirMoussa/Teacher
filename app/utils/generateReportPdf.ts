import { domToPng } from "modern-screenshot";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const CAPTURE_HOST_ID = "report-pdf-capture-host";
const CAPTURE_SHEET_ID = "report-pdf-capture-sheet";

export type GeneratedPdfFile = {
  blob: Blob;
  fileName: string;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const waitForImage = async (image: HTMLImageElement) => {
  image.loading = "eager";

  if (!image.complete || image.naturalWidth <= 0) {
    await new Promise<void>((resolve) => {
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;

        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        resolve();
      };

      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, 10000);
    });
  }

  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      // load/error handling above is enough if decode() fails.
    }
  }
};

const waitForAssets = async (element: HTMLElement) => {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(images.map(waitForImage));

  await waitForPaint();
  await wait(120);
};

const sanitizeFileName = (fileName: string) =>
  fileName
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const createCaptureClone = (source: HTMLElement) => {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.id = CAPTURE_SHEET_ID;

  const computed = window.getComputedStyle(source);

  clone.style.setProperty("position", "relative", "important");
  clone.style.setProperty("display", "block", "important");
  clone.style.setProperty("width", `${A4_WIDTH_MM}mm`, "important");
  clone.style.setProperty("height", `${A4_HEIGHT_MM}mm`, "important");
  clone.style.setProperty("min-width", `${A4_WIDTH_MM}mm`, "important");
  clone.style.setProperty("min-height", `${A4_HEIGHT_MM}mm`, "important");
  clone.style.setProperty("max-width", `${A4_WIDTH_MM}mm`, "important");
  clone.style.setProperty("max-height", `${A4_HEIGHT_MM}mm`, "important");
  clone.style.setProperty("margin", "0", "important");
  clone.style.setProperty("transform", "none", "important");
  clone.style.setProperty("transform-origin", "top left", "important");
  clone.style.setProperty("box-shadow", "none", "important");
  clone.style.setProperty("border", "0", "important");
  clone.style.setProperty("overflow", "hidden", "important");
  clone.style.setProperty("background", "#ffffff", "important");
  clone.style.setProperty("font-family", computed.fontFamily, "important");
  clone.style.setProperty("font-style", computed.fontStyle, "important");
  clone.style.setProperty("font-stretch", computed.fontStretch, "important");
  clone.style.setProperty("font-kerning", computed.fontKerning, "important");
  clone.style.setProperty("direction", "rtl", "important");

  return clone;
};

const createCaptureHost = (clone: HTMLElement) => {
  const host = document.createElement("div");
  host.id = CAPTURE_HOST_ID;
  host.dir = "rtl";

  host.style.position = "fixed";
  host.style.top = "0";
  host.style.left = "0";
  host.style.width = `${A4_WIDTH_MM}mm`;
  host.style.height = `${A4_HEIGHT_MM}mm`;
  host.style.margin = "0";
  host.style.padding = "0";
  host.style.overflow = "hidden";
  host.style.pointerEvents = "none";
  host.style.background = "#ffffff";
  host.style.zIndex = "-2147483647";

  host.appendChild(clone);
  document.body.appendChild(host);

  return host;
};

const dataUrlToImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read PDF snapshot."));
    image.src = dataUrl;
  });

const assertSnapshotIsNotBlank = async (dataUrl: string) => {
  const image = await dataUrlToImage(dataUrl);

  const sample = document.createElement("canvas");
  sample.width = 32;
  sample.height = 45;

  const context = sample.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  context.drawImage(image, 0, 0, sample.width, sample.height);

  const pixels = context.getImageData(
    0,
    0,
    sample.width,
    sample.height,
  ).data;

  let nonWhitePixels = 0;
  const totalPixels = sample.width * sample.height;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];

    const isWhite =
      alpha === 0 || (red >= 248 && green >= 248 && blue >= 248);

    if (!isWhite) {
      nonWhitePixels += 1;
    }
  }

  if (nonWhitePixels / totalPixels < 0.002) {
    throw new Error("PDF snapshot is blank.");
  }
};

export const isAppleMobileDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  const iPhoneOrIPad = /iPhone|iPad|iPod/i.test(userAgent);
  const modernIPad = platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return iPhoneOrIPad || modernIPad;
};

export const downloadPdfBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 30000);
};

export const sharePdfBlob = async (
  blob: Blob,
  fileName: string,
) => {
  const file = new File([blob], fileName, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  if (typeof navigator.share !== "function") {
    throw new Error("Web Share API is not available.");
  }

  const shareData: ShareData = {
    title: fileName.replace(/\.pdf$/i, ""),
    files: [file],
  };

  if (
    typeof navigator.canShare === "function" &&
    !navigator.canShare(shareData)
  ) {
    throw new Error("Sharing PDF files is not supported on this device.");
  }

  await navigator.share(shareData);
};

export const generateReportPdf = async (
  elementId: string,
  fileName = "تقرير-الأنشطة.pdf",
): Promise<GeneratedPdfFile> => {
  const source = document.getElementById(elementId);

  if (!(source instanceof HTMLElement)) {
    throw new Error(`PDF element "${elementId}" was not found.`);
  }

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const clone = createCaptureClone(source);
  const host = createCaptureHost(clone);

  try {
    await waitForAssets(clone);

    const width = clone.offsetWidth;
    const height = clone.offsetHeight;

    if (!width || !height) {
      throw new Error("PDF report has invalid dimensions.");
    }

    const imageData = await domToPng(clone, {
      width,
      height,
      scale: 2,
      backgroundColor: "#ffffff",
      timeout: 30000,
      fetch: {
        requestInit: {
          cache: "force-cache",
        },
      },
      font: {
        preferredFormat: "woff2",
      },
      style: {
        margin: "0",
        transform: "none",
        transformOrigin: "top left",
        boxShadow: "none",
        overflow: "hidden",
        background: "#ffffff",
      },
    });

    await assertSnapshotIsNotBlank(imageData);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(
      imageData,
      "PNG",
      0,
      0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      undefined,
      "FAST",
    );

    let finalFileName = sanitizeFileName(fileName);

    if (!finalFileName.toLowerCase().endsWith(".pdf")) {
      finalFileName += ".pdf";
    }

    return {
      blob: pdf.output("blob"),
      fileName: finalFileName,
    };
  } finally {
    host.remove();
  }
};
