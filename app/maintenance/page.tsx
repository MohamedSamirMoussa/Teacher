export default function MaintenancePage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f7f8f8] px-4"
    >
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl text-white">
          !
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          الموقع غير متاح مؤقتًا
        </h1>

        <p className="mt-4 text-base leading-8 text-gray-500">
          الموقع متوقف مؤقتًا، وسيتم إعادة تشغيله قريبًا.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            شكرًا لتفهمكم
          </p>
        </div>
      </div>
    </main>
  );
}