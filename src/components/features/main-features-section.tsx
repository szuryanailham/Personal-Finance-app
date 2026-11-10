import { FeatureDetail } from "@/components/features/feature-detail";
import transactionImage from "@/components/images/illustrations/fiture-detail-1.png";
import balanceImage from "@/components/images/illustrations/fiture-detail-2.png";
import statisticsImage from "@/components/images/illustrations/fiture-detail-3.png";
import historyImage from "@/components/images/illustrations/fiture-detail-4.png";
import excelImage from "@/components/images/illustrations/fiture-detail-5.png";

const FEATURES = [
  {
    id: "transaction-management",
    image: transactionImage,
    imageAlt: "Tampilan pencatatan pemasukan dan pengeluaran Artoku",
    title: "1. Catat Pemasukan dan Pengeluaran dengan Mudah",
    description: "Tidak perlu lagi mengandalkan ingatan untuk mengetahui ke mana uangmu digunakan. Catat setiap pemasukan dan pengeluaran dalam satu aplikasi agar aktivitas keuangan sehari-hari lebih terorganisir dan mudah ditelusuri.",
  },
  {
    id: "balance-monitoring",
    image: balanceImage,
    imageAlt: "Tampilan pemantauan saldo dan kondisi keuangan Artoku",
    title: "2. Pantau Saldo dan Kondisi Keuangan",
    description: "Ketahui gambaran keuanganmu melalui informasi pemasukan, pengeluaran, dan saldo yang tercatat di Artoku. Dengan informasi yang lebih terorganisir, kamu dapat memahami kondisi keuangan tanpa harus menghitung seluruh transaksi secara manual.",
  },
  {
    id: "financial-statistics",
    image: statisticsImage,
    imageAlt: "Tampilan ringkasan dan statistik keuangan Artoku",
    title: "3. Lihat Statistik Keuangan dengan Lebih Jelas",
    description: "Memahami keuangan tidak harus dimulai dari perhitungan yang rumit. Artoku membantu menyajikan informasi transaksi dalam ringkasan dan statistik agar kamu lebih mudah mengenali pola pemasukan dan pengeluaran.",
  },
  {
    id: "transaction-history",
    image: historyImage,
    imageAlt: "Tampilan riwayat transaksi pemasukan dan pengeluaran Artoku",
    title: "4. Kelola Riwayat Transaksi dalam Satu Tempat",
    description: "Tidak perlu bingung mencari catatan pengeluaran yang sudah lewat. Dengan riwayat transaksi, kamu dapat melihat kembali pemasukan dan pengeluaran yang telah dicatat untuk membantu menelusuri aktivitas keuangan sebelumnya.",
  },
  {
    id: "excel-import-export",
    image: excelImage,
    imageAlt: "Tampilan fitur impor dan ekspor transaksi Excel Artoku",
    title: "5. Impor dan Ekspor Transaksi Excel",
    description: "Punya catatan transaksi di Excel atau ingin menyimpan data keuangan untuk kebutuhan pribadi? Fitur impor dan ekspor membantu proses pemindahan serta pengelolaan data transaksi agar lebih praktis.",
  },
] as const;

export function MainFeaturesSection() {
  return (
    <section id="features" aria-labelledby="main-features-title" className="scroll-mt-24 bg-white px-5 py-16 font-inter sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2 id="main-features-title" className="text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Fitur Utama <span className="text-[#14864A]">Artoku</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Artoku memudahkan kamu mencatat dan memantau transaksi untuk memahami keuangan sehari-hari.
          </p>
        </header>
        <div className="mt-12 flex flex-col gap-16 sm:mt-16 sm:gap-20 lg:mt-20 lg:gap-24">
          {FEATURES.map((feature, index) => (
            <FeatureDetail key={feature.id} {...feature} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
