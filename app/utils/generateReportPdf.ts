import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });

const waitForImage = async (image: HTMLImageElement) => {
  if (image.complete && image.naturalWidth > 0) {
    try {
      await image.decode();
    } catch {}

    return;
  }

  await new Promise<void>((resolve) => {
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;

      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);

      resolve();
    };

    image.loading = "eager";

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });

    window.setTimeout(finish, 10000);
  });

  try {
    await image.decode();
  } catch {}
};

const waitForImages = async (element: HTMLElement) => {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(images.map((image) => waitForImage(image)));
};

const sanitizeFileName = (fileName: string) =>
  fileName
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

export const generateReportPdf = async (
  elementId: string,
  fileName = "تقرير-الأنشطة.pdf",
) => {
  const source = document.getElementById(elementId);

  if (!source) {
    throw new Error(`PDF element "${elementId}" was not found.`);
  }

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await waitForImages(source);
  await waitForPaint();
  await wait(150);

  const width = source.offsetWidth;
  const height = source.offsetHeight;

  if (!width || !height) {
    throw new Error("PDF report has invalid dimensions.");
  }

  const canvas = await html2canvas(source, {
    width,
    height,
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
    removeContainer: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: Math.max(width, document.documentElement.clientWidth),
    windowHeight: Math.max(height, document.documentElement.clientHeight),
    onclone: (clonedDocument) => {
      const clonedSource = clonedDocument.getElementById(elementId);

      if (!clonedSource) {
        return;
      }

      const clonedWrapper = clonedSource.closest(
        ".pdf-render-report",
      ) as HTMLElement | null;

      if (clonedWrapper) {
        clonedWrapper.style.position = "fixed";
        clonedWrapper.style.top = "0";
        clonedWrapper.style.left = "0";
        clonedWrapper.style.zIndex = "0";
        clonedWrapper.style.width = "210mm";
        clonedWrapper.style.height = "297mm";
        clonedWrapper.style.minWidth = "210mm";
        clonedWrapper.style.minHeight = "297mm";
        clonedWrapper.style.maxWidth = "210mm";
        clonedWrapper.style.maxHeight = "297mm";
        clonedWrapper.style.margin = "0";
        clonedWrapper.style.padding = "0";
        clonedWrapper.style.overflow = "hidden";
        clonedWrapper.style.background = "#ffffff";
      }

      clonedSource.style.margin = "0";
      clonedSource.style.border = "0";
      clonedSource.style.borderRadius = "0";
      clonedSource.style.boxShadow = "none";
      clonedSource.style.overflow = "hidden";
      clonedSource.style.background = "#ffffff";
    },
  });

  const imageData = canvas.toDataURL("image/jpeg", 0.97);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  pdf.addImage(
    imageData,
    "JPEG",
    0,
    0,
    210,
    297,
    undefined,
    "FAST",
  );

  let finalFileName = sanitizeFileName(fileName);

  if (!finalFileName.toLowerCase().endsWith(".pdf")) {
    finalFileName += ".pdf";
  }

  pdf.save(finalFileName);
};
