const STEPS = [
  {
    number: "01",
    title: "Buat Akun",
    description:
      "Daftar akun MyArtoku untuk mulai menyimpan catatan keuangan pribadimu dalam satu tempat.",
  },
  {
    number: "02",
    title: "Catat Transaksi",
    description:
      "Masukkan pemasukan dan pengeluaran sehari-hari beserta kategori dan keterangannya.",
  },
  {
    number: "03",
    title: "Tinjau Keuanganmu",
    description:
      "Lihat kembali catatan transaksi untuk memahami penggunaan uang dan membangun kebiasaan yang lebih baik.",
  },
] as const;

export function GetStartedSection() {
  return (
    <section
      id="get-started"
      aria-labelledby="get-started-title"
      className="bg-[#F7FBF8] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="get-started-title"
            className="font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Mulai Catat Keuangan dalam <span className="text-[#14864A]">3 Langkah</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Mulai dari langkah sederhana untuk membiasakan diri mencatat keuangan setiap hari.
          </p>
        </header>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {STEPS.map(({ number, title, description }) => (
            <li
              key={number}
              className="rounded-3xl bg-[#1F8C52] p-7 sm:p-8"
            >
              <span aria-hidden="true" className="block font-inter text-3xl font-semibold tracking-[-0.04em] text-white">
                {number}
              </span>
              <h3 className="mt-7 font-inter text-xl leading-7 font-semibold text-white">
                {title}
              </h3>
              <p className="mt-3 font-inter text-base leading-7 text-white">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
