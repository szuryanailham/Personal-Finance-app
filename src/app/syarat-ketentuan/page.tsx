import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Syarat dan Ketentuan | Artoku",
  description: "Syarat dan ketentuan penggunaan layanan Artoku, termasuk akun, hak dan kewajiban pengguna, data, dan fitur pencatatan keuangan pribadi.",
  path: "/syarat-ketentuan",
});

const sectionTitles = ["Definisi", "Ketentuan Penggunaan Layanan", "Akun Pengguna", "Hak dan Kewajiban Pengguna", "Layanan dan Fitur Artoku", "Data dan Informasi Keuangan", "Pembatasan Penggunaan", "Hak Kekayaan Intelektual", "Ketersediaan Layanan dan Batasan Tanggung Jawab", "Penangguhan dan Penghentian Akun", "Perubahan Syarat dan Ketentuan", "Hukum yang Berlaku", "Hubungi Kami"];

export default async function TermsPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="min-h-screen bg-white font-inter">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1}>
        <header className="bg-[#42A86E]/10 px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-[#14864A] uppercase">Ketentuan Layanan</p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-5xl">Syarat dan Ketentuan <span className="text-[#14864A]">Artoku</span></h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">Selamat datang di Artoku. Syarat dan Ketentuan ini mengatur penggunaan website dan aplikasi Artoku, termasuk fitur serta layanan yang tersedia.</p>
            <p className="mt-5 text-sm font-medium text-[#14864A]">Terakhir diperbarui: 10 November 2026</p>
          </div>
        </header>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
          <aside>
            <nav aria-label="Daftar isi syarat dan ketentuan" className="rounded-2xl border border-[#14864A]/15 bg-[#F7FBF8] p-6 lg:sticky lg:top-28">
              <h2 className="font-semibold text-slate-950">Daftar Isi</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {sectionTitles.map((title, index) => (
                  <li key={title}><a href={`#bagian-${index + 1}`} className="rounded hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">{index + 1}. {title}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="min-w-0 text-base leading-8 text-slate-600">
            <p>Dengan membuat akun, mengakses, atau menggunakan layanan Artoku, Anda dianggap telah membaca dan memahami ketentuan ini. Jika Anda tidak menyetujui ketentuan yang berlaku, harap tidak menggunakan layanan Artoku.</p>
            <section id="bagian-1" aria-labelledby="judul-1" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-1" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">1. Definisi</h2>
              <div className="space-y-4">
                <p>Dalam dokumen ini, istilah berikut memiliki arti:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li><strong className="font-semibold text-slate-950">Artoku:</strong> platform aplikasi pencatatan keuangan pribadi yang disediakan melalui website dan aplikasi.</li><li><strong className="font-semibold text-slate-950">Pengguna:</strong> setiap individu yang mengakses atau menggunakan layanan Artoku.</li><li><strong className="font-semibold text-slate-950">Akun:</strong> akun yang dibuat pengguna untuk mengakses layanan Artoku.</li><li><strong className="font-semibold text-slate-950">Layanan:</strong> seluruh fitur dan fasilitas yang tersedia pada platform Artoku.</li><li><strong className="font-semibold text-slate-950">Data Pengguna:</strong> informasi pribadi dan informasi transaksi yang diberikan atau dimasukkan pengguna ke dalam layanan Artoku.</li></ul>
              </div>
            </section>
            <section id="bagian-2" aria-labelledby="judul-2" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-2" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">2. Ketentuan Penggunaan Layanan</h2>
              <div className="space-y-4">
                <p>Pengguna dapat menggunakan Artoku untuk membantu mencatat dan memantau aktivitas keuangan pribadi melalui fitur yang tersedia.</p>
                <p>Dalam menggunakan layanan, pengguna setuju untuk:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li>Menggunakan Artoku sesuai dengan tujuan dan fungsi layanan.</li><li>Memberikan informasi yang benar dan tidak menyesatkan.</li><li>Tidak menggunakan layanan untuk aktivitas yang melanggar hukum.</li><li>Tidak mengganggu keamanan, stabilitas, atau operasional platform.</li><li>Mematuhi ketentuan penggunaan yang berlaku.</li></ul>
                <p>Artoku dapat melakukan pembaruan, penyesuaian, penambahan, atau penghentian fitur sesuai dengan perkembangan layanan.</p>
              </div>
            </section>
            <section id="bagian-3" aria-labelledby="judul-3" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-3" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">3. Akun Pengguna</h2>
              <div className="space-y-4">
                <p>Untuk menggunakan fitur tertentu, pengguna mungkin perlu membuat akun Artoku.</p>
                <p>Pengguna bertanggung jawab untuk:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li>Memberikan informasi pendaftaran yang benar dan akurat.</li><li>Menjaga kerahasiaan informasi login.</li><li>Menjaga keamanan akses akun.</li><li>Segera menghubungi Artoku apabila mengetahui adanya penggunaan akun tanpa izin.</li></ul>
                <p>Pengguna bertanggung jawab atas aktivitas yang dilakukan melalui akunnya, sepanjang sesuai dengan ketentuan hukum yang berlaku.</p>
                <p>Artoku dapat mengambil tindakan terhadap akun yang terbukti digunakan untuk melanggar ketentuan penggunaan atau membahayakan keamanan layanan.</p>
              </div>
            </section>
            <section id="bagian-4" aria-labelledby="judul-4" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-4" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">4. Hak dan Kewajiban Pengguna</h2>
              <div className="space-y-4">
                <h3 className="pt-3 text-lg font-semibold text-slate-950">A. Hak Pengguna</h3>
                <p>Pengguna berhak untuk:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li>Mengakses layanan sesuai dengan fitur yang tersedia.</li><li>Menggunakan fitur pencatatan keuangan pribadi.</li><li>Mendapatkan informasi mengenai penggunaan layanan.</li><li>Menyampaikan pertanyaan, keluhan, dan masukan kepada Artoku.</li><li>Mengajukan permintaan terkait data pribadi sesuai Kebijakan Privasi dan peraturan yang berlaku.</li></ul>
                <h3 className="pt-3 text-lg font-semibold text-slate-950">B. Kewajiban Pengguna</h3>
                <p>Pengguna berkewajiban untuk:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li>Menggunakan layanan secara bertanggung jawab.</li><li>Memastikan informasi transaksi yang dimasukkan sesuai dengan kondisi sebenarnya.</li><li>Menjaga keamanan akun dan informasi login.</li><li>Tidak menyalahgunakan layanan untuk aktivitas ilegal.</li><li>Tidak melakukan tindakan yang dapat merugikan pengguna lain atau Artoku.</li></ul>
              </div>
            </section>
            <section id="bagian-5" aria-labelledby="judul-5" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-5" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">5. Layanan dan Fitur Artoku</h2>
              <div className="space-y-4">
                <p>Artoku menyediakan layanan pencatatan keuangan pribadi yang membantu pengguna mencatat pemasukan, pengeluaran, dan memantau informasi transaksi.</p>
                <p>Fitur yang tersedia dapat mengalami perubahan seiring pengembangan produk.</p>
                <p>Artoku berupaya menjaga agar layanan dapat digunakan dengan baik, tetapi tidak menjamin bahwa seluruh fitur akan selalu tersedia tanpa gangguan.</p>
                <p>Artoku dapat melakukan pemeliharaan sistem, pembaruan, atau penyesuaian layanan untuk meningkatkan kualitas dan keamanan platform.</p>
              </div>
            </section>
            <section id="bagian-6" aria-labelledby="judul-6" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-6" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">6. Data dan Informasi Keuangan</h2>
              <div className="space-y-4">
                <p>Data transaksi yang dimasukkan ke dalam Artoku merupakan informasi yang diberikan oleh pengguna.</p>
                <p>Pengguna bertanggung jawab atas keakuratan dan kelengkapan data yang dicatat.</p>
                <p>Artoku menyediakan fasilitas pencatatan dan pemantauan informasi keuangan, bukan layanan konsultasi, nasihat investasi, atau rekomendasi keuangan profesional.</p>
                <p>Pengguna tetap bertanggung jawab atas keputusan keuangan yang diambil berdasarkan informasi yang dicatat atau ditampilkan melalui Artoku.</p>
                <p>Pengelolaan informasi pribadi dan data pengguna dijelaskan lebih lanjut dalam <Link href="/kebijakan-pivasi" className="font-semibold text-[#14864A] underline underline-offset-4">Kebijakan Privasi Artoku</Link>.</p>
              </div>
            </section>
            <section id="bagian-7" aria-labelledby="judul-7" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-7" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">7. Pembatasan Penggunaan</h2>
              <div className="space-y-4">
                <p>Pengguna dilarang menggunakan Artoku untuk:</p>
                <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]"><li>Melakukan aktivitas yang melanggar hukum.</li><li>Mengakses sistem atau akun pengguna lain tanpa izin.</li><li>Mengganggu atau merusak sistem dan infrastruktur layanan.</li><li>Menyebarkan perangkat lunak berbahaya.</li><li>Melakukan tindakan yang dapat mengganggu keamanan dan kenyamanan pengguna lain.</li><li>Menyalahgunakan fitur atau layanan Artoku untuk tujuan yang tidak semestinya.</li></ul>
                <p>Artoku berhak mengambil tindakan yang sesuai apabila ditemukan pelanggaran terhadap ketentuan ini, dengan tetap memperhatikan peraturan yang berlaku.</p>
              </div>
            </section>
            <section id="bagian-8" aria-labelledby="judul-8" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-8" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">8. Hak Kekayaan Intelektual</h2>
              <div className="space-y-4">
                <p>Nama, logo, desain, tampilan, elemen visual, konten, dan materi lain yang menjadi bagian dari Artoku merupakan aset intelektual milik Artoku atau pihak yang memberikan hak penggunaannya.</p>
                <p>Pengguna tidak diperkenankan menyalin, mendistribusikan, memodifikasi, atau menggunakan materi tersebut untuk tujuan komersial tanpa izin dari pemilik hak yang bersangkutan, kecuali diperbolehkan oleh hukum.</p>
              </div>
            </section>
            <section id="bagian-9" aria-labelledby="judul-9" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-9" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">9. Ketersediaan Layanan dan Batasan Tanggung Jawab</h2>
              <div className="space-y-4">
                <p>Artoku berupaya menyediakan layanan yang stabil dan dapat diakses oleh pengguna.</p>
                <p>Namun, gangguan dapat terjadi karena pemeliharaan sistem, kendala teknis, gangguan jaringan, atau faktor lain di luar kendali Artoku.</p>
                <p>Artoku tidak menjamin bahwa layanan selalu tersedia tanpa gangguan atau sepenuhnya bebas dari kesalahan.</p>
                <p>Sepanjang diperbolehkan oleh hukum, Artoku tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan layanan yang tidak sesuai dengan ketentuan ini, kesalahan informasi yang dimasukkan pengguna, atau gangguan di luar kendali yang wajar.</p>
                <p>Ketentuan ini tidak menghapus tanggung jawab yang tidak dapat dikecualikan berdasarkan peraturan perundang-undangan.</p>
              </div>
            </section>
            <section id="bagian-10" aria-labelledby="judul-10" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-10" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">10. Penangguhan dan Penghentian Akun</h2>
              <div className="space-y-4">
                <p>Artoku dapat membatasi, menangguhkan, atau menghentikan akses akun apabila terdapat indikasi pelanggaran terhadap Syarat dan Ketentuan ini, penyalahgunaan layanan, atau alasan lain yang dibenarkan oleh hukum.</p>
                <p>Pengguna juga dapat mengajukan permintaan penutupan akun melalui saluran komunikasi resmi Artoku.</p>
                <p>Penanganan data setelah akun ditutup akan mengikuti Kebijakan Privasi dan ketentuan hukum yang berlaku.</p>
              </div>
            </section>
            <section id="bagian-11" aria-labelledby="judul-11" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-11" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">11. Perubahan Syarat dan Ketentuan</h2>
              <div className="space-y-4">
                <p>Artoku dapat memperbarui Syarat dan Ketentuan ini seiring dengan perkembangan produk, perubahan layanan, atau penyesuaian terhadap peraturan yang berlaku.</p>
                <p>Setiap perubahan akan dipublikasikan melalui halaman ini dengan mencantumkan tanggal pembaruan terbaru.</p>
                <p>Pengguna disarankan untuk memeriksa halaman ini secara berkala agar mengetahui ketentuan yang berlaku.</p>
              </div>
            </section>
            <section id="bagian-12" aria-labelledby="judul-12" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-12" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">12. Hukum yang Berlaku</h2>
              <div className="space-y-4">
                <p>Syarat dan Ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia.</p>
                <p>Setiap permasalahan yang timbul terkait penggunaan layanan Artoku akan diselesaikan sesuai dengan ketentuan hukum yang berlaku di Indonesia.</p>
              </div>
            </section>
            <section id="bagian-13" aria-labelledby="judul-13" className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
              <h2 id="judul-13" className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">13. Hubungi Kami</h2>
              <div className="space-y-4">
                <p>Jika Anda memiliki pertanyaan, keluhan, atau membutuhkan penjelasan lebih lanjut mengenai Syarat dan Ketentuan ini, silakan menghubungi tim Artoku melalui:</p>
                <p><strong className="font-semibold text-slate-950">Email:</strong> <a href="mailto:appartoku@gmail.com" className="text-[#14864A] underline underline-offset-4">appartoku@gmail.com</a></p>
                <p><strong className="font-semibold text-slate-950">Halaman Kontak:</strong> <Link href="/contact" className="break-words text-[#14864A] underline underline-offset-4">https://www.myartoku.com/contact</Link></p>
              </div>
            </section>
            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="font-semibold text-slate-950">Artoku</p>
              <p className="mt-2">Membantu membangun kebiasaan pencatatan keuangan pribadi yang lebih baik.</p>
            </div>
          </article>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
