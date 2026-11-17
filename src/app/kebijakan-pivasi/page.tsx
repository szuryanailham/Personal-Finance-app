import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import privacyHero from "@/components/images/illustrations/privacy-hero.png";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Kebijakan Privasi | Artoku",
  description: "Bagaimana Artoku mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi serta data keuangan kamu.",
  path: "/kebijakan-pivasi",
  image: privacyHero.src,
});

const sections = [
  {
    "title": "Informasi yang Kami Kumpulkan",
    "paragraphs": [
      "Untuk menyediakan dan meningkatkan layanan, Artoku dapat mengumpulkan beberapa jenis informasi berikut:"
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Bagaimana Kami Menggunakan Informasi",
    "paragraphs": [
      "Informasi yang dikumpulkan digunakan untuk tujuan berikut:"
    ],
    "items": [
      "Membuat dan mengelola akun pengguna.",
      "Menyediakan fitur pencatatan keuangan.",
      "Menampilkan informasi transaksi dan ringkasan keuangan.",
      "Membantu menangani pertanyaan, keluhan, dan masukan pengguna.",
      "Menjaga keamanan serta stabilitas layanan.",
      "Mengembangkan dan meningkatkan kualitas Artoku.",
      "Memenuhi kewajiban hukum yang berlaku."
    ],
    "closing": ""
  },
  {
    "title": "Penyimpanan dan Keamanan Data",
    "paragraphs": [
      "Artoku berupaya menjaga keamanan informasi pengguna melalui langkah-langkah perlindungan teknis dan pengelolaan data yang sesuai dengan kebutuhan layanan.",
      "Kami berupaya mencegah akses, penggunaan, perubahan, atau pengungkapan informasi tanpa izin.",
      "Meskipun demikian, tidak ada sistem penyimpanan dan pengiriman data melalui internet yang dapat menjamin keamanan secara mutlak."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Pembagian Informasi kepada Pihak Ketiga",
    "paragraphs": [
      "Artoku tidak menjual informasi pribadi pengguna.",
      "Dalam kondisi tertentu, informasi dapat diproses atau dibagikan kepada penyedia layanan pihak ketiga yang mendukung operasional Artoku, seperti penyedia infrastruktur, penyimpanan data, atau layanan teknis lainnya.",
      "Pembagian tersebut dilakukan sesuai kebutuhan penyediaan layanan dan kewajiban perlindungan data yang berlaku.",
      "Artoku juga dapat mengungkapkan informasi apabila diwajibkan oleh hukum atau permintaan resmi dari pihak berwenang."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Penyimpanan dan Penghapusan Data",
    "paragraphs": [
      "Artoku menyimpan informasi pengguna selama diperlukan untuk menyediakan layanan, memenuhi tujuan pengumpulan data, serta menjalankan kewajiban hukum yang berlaku.",
      "Pengguna dapat mengajukan permintaan untuk memperbarui atau menghapus informasi pribadi sesuai dengan ketentuan yang berlaku dan mekanisme yang disediakan Artoku."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Hak Pengguna atas Data Pribadi",
    "paragraphs": [
      "Kami menghargai hak pengguna atas informasi pribadinya.",
      "Sesuai ketentuan peraturan perlindungan data pribadi yang berlaku, pengguna dapat mengajukan permintaan untuk:"
    ],
    "items": [
      "Mengetahui informasi pribadi yang dikelola Artoku.",
      "Memperbarui atau memperbaiki informasi yang tidak akurat.",
      "Meminta penghapusan informasi pribadi sesuai ketentuan.",
      "Menarik persetujuan pemrosesan data apabila pemrosesan didasarkan pada persetujuan.",
      "Mengajukan keberatan atau permintaan terkait pemrosesan data sesuai hak yang berlaku."
    ],
    "closing": "Untuk menggunakan hak tersebut, pengguna dapat menghubungi Artoku melalui saluran kontak yang tersedia."
  },
  {
    "title": "Cookie dan Teknologi Serupa",
    "paragraphs": [
      "Artoku dapat menggunakan cookie atau teknologi serupa untuk mendukung fungsi website, menjaga sesi pengguna, serta meningkatkan pengalaman penggunaan layanan.",
      "Penggunaan cookie dilakukan sesuai kebutuhan dan konfigurasi teknologi yang digunakan Artoku.",
      "Pengguna dapat mengatur penggunaan cookie melalui pengaturan browser, dengan memperhatikan bahwa beberapa fungsi layanan mungkin terpengaruh."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Perlindungan Data Anak",
    "paragraphs": [
      "Layanan Artoku ditujukan kepada pengguna yang memenuhi persyaratan usia dan ketentuan penggunaan layanan.",
      "Jika kami mengetahui bahwa informasi pribadi anak telah dikumpulkan tanpa dasar atau persetujuan yang diwajibkan, kami akan mengambil langkah yang sesuai berdasarkan ketentuan hukum yang berlaku."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Perubahan Kebijakan Privasi",
    "paragraphs": [
      "Artoku dapat memperbarui Kebijakan Privasi ini seiring dengan perkembangan fitur, perubahan layanan, atau penyesuaian terhadap peraturan yang berlaku.",
      "Setiap perubahan akan dipublikasikan melalui halaman ini dengan mencantumkan tanggal pembaruan terbaru.",
      "Kami menyarankan pengguna untuk memeriksa halaman ini secara berkala."
    ],
    "items": [],
    "closing": ""
  },
  {
    "title": "Hubungi Kami",
    "paragraphs": [
      "Jika kamu memiliki pertanyaan, permintaan, atau keluhan terkait Kebijakan Privasi dan pengelolaan data pribadi, silakan hubungi tim Artoku melalui:"
    ],
    "items": [],
    "closing": "Kami akan berupaya menanggapi pertanyaan dan permintaan yang disampaikan melalui saluran komunikasi resmi."
  }
];

const groups = [
  {
    "title": "A. Informasi Pribadi",
    "description": "Informasi yang diberikan ketika kamu membuat akun atau menghubungi kami, seperti:",
    "items": [
      "Nama pengguna.",
      "Alamat email.",
      "Informasi akun yang diperlukan untuk menggunakan layanan."
    ]
  },
  {
    "title": "B. Informasi Keuangan",
    "description": "Informasi yang kamu masukkan ketika menggunakan fitur pencatatan keuangan Artoku, seperti:",
    "items": [
      "Catatan pemasukan.",
      "Catatan pengeluaran.",
      "Informasi transaksi.",
      "Data lain yang berkaitan dengan aktivitas pencatatan keuangan."
    ]
  },
  {
    "title": "C. Informasi Penggunaan",
    "description": "Informasi teknis yang dapat dikumpulkan ketika kamu mengakses layanan, seperti:",
    "items": [
      "Jenis perangkat.",
      "Browser yang digunakan.",
      "Informasi aktivitas penggunaan.",
      "Data teknis untuk membantu menjaga performa layanan."
    ]
  }
];

function PolicyList({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-[#14864A]">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(cookieStore.get(AUTH_TOKEN_COOKIE)?.value, cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value);
  return (
    <div className="min-h-screen bg-white font-inter">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1}>
        <header className="bg-[#42A86E]/10 px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[#14864A] uppercase">Privasi & Keamanan</p>
              <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-5xl">Kebijakan Privasi <span className="text-[#14864A]">Artoku</span></h1>
              <p className="mt-6 text-base leading-8 text-slate-600">Artoku menghargai privasi dan keamanan data setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi serta data keuangan yang kamu masukkan saat menggunakan layanan Artoku.</p>
              <p className="mt-5 text-sm font-medium text-[#14864A]">Terakhir diperbarui: 10 November 2026</p>
            </div>
            <Image src={privacyHero} alt="Ilustrasi perlindungan privasi dan keamanan data pengguna Artoku" preload sizes="(max-width: 1023px) calc(100vw - 40px), 512px" className="mx-auto h-auto w-full max-w-lg object-contain" />
          </div>
        </header>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
          <aside>
            <nav aria-label="Daftar isi kebijakan privasi" className="rounded-2xl border border-[#14864A]/15 bg-[#F7FBF8] p-6 lg:sticky lg:top-28">
              <h2 className="font-semibold text-slate-950">Daftar Isi</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {sections.map((section, index) => <li key={section.title}><a href={`#bagian-${index + 1}`} className="rounded hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">{index + 1}. {section.title}</a></li>)}
              </ol>
            </nav>
          </aside>
          <article className="min-w-0 text-base leading-8 text-slate-600">
            <p>Dengan menggunakan Artoku, kamu diharapkan membaca dan memahami kebijakan ini agar mengetahui bagaimana informasi kamu dikelola.</p>
            {sections.map((section, index) => (
              <section key={section.title} id={`bagian-${index + 1}`} aria-labelledby={`judul-${index + 1}`} className="mt-10 scroll-mt-28 border-t border-slate-200 pt-8">
                <h2 id={`judul-${index + 1}`} className="mb-5 text-2xl leading-8 font-semibold tracking-tight text-slate-950">{index + 1}. {section.title}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {index === 0 && groups.map((group) => (
                    <div key={group.title} className="space-y-3 pt-3">
                      <h3 className="text-lg font-semibold text-slate-950">{group.title}</h3>
                      <p>{group.description}</p>
                      <PolicyList items={group.items} />
                    </div>
                  ))}
                  {section.items.length > 0 && <PolicyList items={section.items} />}
                  {index === 9 && <p className="font-semibold text-slate-950">Email: <a href="mailto:appartoku@gmail.com" className="text-[#14864A] underline underline-offset-4">appartoku@gmail.com</a></p>}
                  {section.closing && <p>{section.closing}</p>}
                  {index === 9 && <Link href="/contact" className="inline-flex rounded-lg bg-[#14864A] px-5 py-2 font-semibold text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">Hubungi Artoku</Link>}
                </div>
              </section>
            ))}
            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="font-semibold text-slate-950">Artoku</p>
              <p className="mt-2">Membangun kebiasaan pencatatan keuangan yang lebih baik melalui teknologi yang sederhana dan mudah digunakan.</p>
            </div>
          </article>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
