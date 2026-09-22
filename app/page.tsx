import ReportForm from "./components/ReportForm/ReportForm";

export default function Home() {
  return (
    <main>
      <section className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">أنشئ تقريرك بسهولة</h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
            أدخل بيانات التقرير، أضف الحقول التي تحتاجها، ثم اطبع التقرير مباشرة
            بصيغة PDF.
          </p>
        </div>
      </section>

      <ReportForm />
    </main>
  );
}
