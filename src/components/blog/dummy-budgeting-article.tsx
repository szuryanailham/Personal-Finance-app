import Link from "next/link";

// Konten contoh untuk menguji format artikel sebelum integrasi API.
const sections = [
  {
    id: "kenali-pengeluaran",
    title: "1. Kenali pengeluaran bulanan",
    content: (
      <>
        <p>Sebelum menyusun anggaran, catat pengeluaran selama satu bulan. Mulai dari biaya tempat tinggal, transportasi, hingga pembelian kecil seperti kopi dan camilan.</p>
        <p>Pisahkan <strong>kebutuhan utama</strong> dari <em>keinginan</em>. Dengan begitu, kamu bisa melihat pengeluaran mana yang perlu diprioritaskan dan mana yang bisa disesuaikan.</p>
        <h3>Kebutuhan dan keinginan</h3>
        <ul>
          <li><strong>Kebutuhan:</strong> makan sehari-hari, tempat tinggal, dan transportasi.</li>
          <li><strong>Keinginan:</strong> hiburan, belanja tambahan, dan langganan yang jarang digunakan.</li>
          <li><strong>Tujuan keuangan:</strong> tabungan untuk rencana yang sudah kamu tentukan.</li>
        </ul>
      </>
    ),
  },
  {
    id: "contoh-anggaran",
    title: "2. Buat pembagian anggaran",
    content: (
      <>
        <p>Berikut contoh simulasi gaji Rp5.000.000 per bulan. Angka ini hanya data dummy untuk menguji tampilan tabel; sesuaikan pembagian dengan kondisi masing-masing.</p>
        <div role="region" aria-label="Tabel contoh anggaran" tabIndex={0} className="overflow-x-auto rounded-xl border border-slate-200 focus-visible:outline-2 focus-visible:outline-[#14864A]">
          <table className="w-full min-w-96 border-collapse text-left text-sm">
            <caption className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">Simulasi anggaran bulanan</caption>
            <thead className="bg-[#14864A]/10 text-slate-900">
              <tr><th scope="col">Alokasi</th><th scope="col">Persentase</th><th scope="col">Jumlah</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Kebutuhan</th><td>50%</td><td>Rp2.500.000</td></tr>
              <tr><th scope="row">Keinginan</th><td>30%</td><td>Rp1.500.000</td></tr>
              <tr><th scope="row">Tabungan</th><td>20%</td><td>Rp1.000.000</td></tr>
            </tbody>
          </table>
        </div>
        <blockquote>Anggaran yang berguna adalah anggaran yang bisa kamu jalankan dan evaluasi secara konsisten.</blockquote>
      </>
    ),
  },
  {
    id: "langkah-praktis",
    title: "3. Terapkan langkah sederhana",
    content: (
      <>
        <p>Setelah menentukan alokasi, coba rutinitas berikut untuk memudahkan pencatatan:</p>
        <ol>
          <li>Catat pemasukan saat gaji diterima.</li>
          <li>Pisahkan uang sesuai kategori anggaran.</li>
          <li>Catat setiap transaksi agar pengeluaran mudah ditinjau.</li>
          <li>Luangkan waktu di akhir pekan untuk mengecek sisa anggaran.</li>
        </ol>
        <h3>Mulai dari catatan yang sederhana</h3>
        <p>Gunakan nama transaksi yang mudah dikenali, misalnya <code>Belanja mingguan</code>. Kamu juga dapat membaca <Link href="/blog?category=tabungan">artikel tentang tabungan</Link> untuk contoh kebiasaan lain.</p>
        <div className="rounded-xl border border-[#14864A]/20 bg-[#14864A]/5 p-4">
          <strong>Catatan pengujian</strong>
          <p className="mt-1">Bagian ini merupakan contoh callout untuk mengecek warna latar, jarak teks, dan pembungkusan kalimat di layar kecil.</p>
        </div>
      </>
    ),
  },
  {
    id: "evaluasi-anggaran",
    title: "4. Evaluasi di akhir bulan",
    content: (
      <>
        <p>Bandingkan rencana dengan pengeluaran aktual. Jika ada kategori yang melebihi anggaran, periksa penyebabnya dan ubah rencana bulan berikutnya bila diperlukan.</p>
        <hr />
        <p><strong>Inti latihan ini:</strong> kenali pengeluaran, tentukan prioritas, dan lakukan evaluasi rutin. Mulai dari satu langkah yang paling mudah kamu jalankan.</p>
      </>
    ),
  },
];

export const dummyBudgetingToc = sections.map(({ id, title }) => ({ id, title }));

export function DummyBudgetingArticle() {
  return (
    <div id="blog-content" className="space-y-8 text-base leading-8 break-words text-slate-600 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-950 sm:[&_h2]:text-2xl [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_strong]:font-semibold [&_strong]:text-slate-800 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#14864A] [&_blockquote]:bg-[#14864A]/5 [&_blockquote]:p-4 [&_blockquote]:italic [&_a]:text-[#14864A] [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-1 [&_code]:text-sm [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3 [&_tbody_tr]:border-t [&_tbody_tr]:border-slate-200 [&_hr]:border-slate-200">
      <p>Mengatur gaji bulanan dimulai dengan memahami ke mana uang digunakan. Artikel dummy ini menampilkan beberapa format konten untuk menguji kenyamanan membaca di desktop, tablet, dan mobile.</p>
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="space-y-4">
          <h2 id={section.id} className="scroll-mt-24">{section.title}</h2>
          {section.content}
        </section>
      ))}
    </div>
  );
}
