import blogImage from "@/components/images/blog/image-blog.png";
import blogImage2 from "@/components/images/blog/image-blog-2.png";
import blogImage3 from "@/components/images/blog/image-blog-3.png";

export interface BlogSection {
  id: string;
  title: string;
  paragraphs: string[];
  points?: string[];
}

export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  heroImage: string;
  excerpt: string;
  introduction: string;
  sections: BlogSection[];
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostsResponse {
  data: BlogPost[];
  paging: {
    skip: number;
    limit: number;
    totalItem: number;
    hasMore: boolean;
  };
}

export const dummyBlogPostsResponse: BlogPostsResponse = {
  data: [
    {
      id: "9ea07e6b-4f6b-40e8-b303-219cca41d80b",
      authorId: "9313c428-17ed-4045-8c13-ca7354a55733",
      title: "Cara Mengatur Gaji Bulanan",
      slug: "cara-mengatur-gaji-bulanan",
      heroImage: blogImage.src,
      excerpt: "Kelola gaji dengan mengenali kebutuhan, membagi anggaran, dan mengevaluasi pengeluaran setiap bulan.",
      introduction: "Mulai dari gaji yang baru masuk, kita sering merasa masih punya banyak waktu untuk mengatur pengeluaran. Namun, tagihan dan belanja kecil bisa membuat saldo berkurang lebih cepat dari perkiraan. Rencana bulanan membantu kamu melihat prioritas sebelum uang digunakan.",
      sections: [
        {
                "id": "kenali-pengeluaran",
                "title": "1. Kenali pengeluaran bulanan",
                "paragraphs": [
                        "Buka catatan transaksi bulan sebelumnya dan kelompokkan pengeluaran yang berulang. Biaya tempat tinggal, makan, transportasi, dan tagihan menjadi titik awal untuk memahami kebutuhan rutin.",
                        "Pisahkan kebutuhan dari keinginan tanpa harus menghapus semua pengeluaran untuk kesenangan. Tujuannya adalah memberi ruang yang jelas bagi setiap kebutuhan."
                ],
                "points": [
                        "Catat jumlah pemasukan bersih yang benar-benar diterima.",
                        "Tandai tagihan beserta tanggal jatuh temponya.",
                        "Periksa langganan yang masih digunakan."
                ]
        },
        {
                "id": "bagi-anggaran",
                "title": "2. Beri tugas untuk setiap bagian gaji",
                "paragraphs": [
                        "Misalnya, dari pemasukan Rp5.000.000, seseorang mengalokasikan Rp3.000.000 untuk kebutuhan rutin, Rp750.000 untuk pengeluaran fleksibel, Rp750.000 untuk tabungan, dan Rp500.000 untuk kebutuhan berkala. Ini contoh pembagian, bukan patokan yang harus diikuti.",
                        "Sesuaikan nominal dengan biaya hidup dan tanggunganmu. Masukkan juga pengeluaran yang tidak muncul setiap bulan, seperti servis kendaraan atau perpanjangan langganan tahunan."
                ]
        },
        {
                "id": "catat-transaksi",
                "title": "3. Catat transaksi selama bulan berjalan",
                "paragraphs": [
                        "Rencana akan lebih berguna jika dibandingkan dengan transaksi yang benar-benar terjadi. Catat pembelian saat masih mudah diingat, termasuk transaksi kecil.",
                        "Di MyArtoku, gunakan kategori yang konsisten agar pengeluaran sejenis mudah ditinjau. Luangkan beberapa menit setiap pekan untuk memeriksa sisa anggaran."
                ]
        },
        {
                "id": "evaluasi-anggaran",
                "title": "4. Evaluasi tanpa menyalahkan diri sendiri",
                "paragraphs": [
                        "Jika anggaran makan atau transportasi terlewati, cari penyebabnya. Bisa jadi ada perubahan harga, kegiatan tambahan, atau alokasi awal yang terlalu kecil.",
                        "Gunakan temuan itu untuk memperbaiki rencana bulan berikutnya. Anggaran yang realistis tumbuh dari kebiasaan mencatat dan menyesuaikan, bukan dari satu pembagian yang selalu sempurna."
                ]
        }
],
      status: "PUBLISHED",
      publishedAt: "2026-11-05T04:42:15.951435Z",
      readingTimeMinutes: 3,
      createdAt: "2026-11-05T04:42:15.956475Z",
      updatedAt: "2026-11-05T04:42:15.956475Z",
    },
    {
      id: "f268548c-465b-4ba9-ae32-739de8a32d01",
      authorId: "9313c428-17ed-4045-8c13-ca7354a55733",
      title: "Tips Menabung Konsisten Setiap Bulan",
      slug: "tips-menabung-konsisten-setiap-bulan",
      heroImage: blogImage2.src,
      excerpt: "Mulai kebiasaan menabung dengan langkah kecil yang mudah diterapkan setiap bulan.",
      introduction: "Menabung sering terasa sulit ketika menunggu uang tersisa di akhir bulan. Dengan tujuan yang jelas dan rutinitas sederhana, tabungan bisa menjadi bagian dari rencana pengeluaran sejak awal.",
      sections: [
        {
                "id": "tentukan-tujuan",
                "title": "1. Tentukan tujuan yang konkret",
                "paragraphs": [
                        "Tuliskan untuk apa kamu menabung dan kapan dana itu dibutuhkan. Tujuan seperti mengganti laptop kerja lebih mudah direncanakan daripada sekadar ingin punya tabungan.",
                        "Sebagai ilustrasi, target Rp3.000.000 dalam 12 bulan berarti menyisihkan Rp250.000 per bulan, tanpa memperhitungkan bunga atau biaya. Jika jumlahnya terasa berat, sesuaikan target atau waktunya."
                ]
        },
        {
                "id": "mulai-kecil",
                "title": "2. Mulai dari nominal yang bisa diulang",
                "paragraphs": [
                        "Pilih nominal yang masih memberi ruang untuk kebutuhan rutin. Konsistensi lebih mudah dibangun ketika kamu tidak perlu mengambil kembali tabungan untuk membayar tagihan.",
                        "Setelah pemasukan diterima, sisihkan nominal yang sudah direncanakan ke tempat terpisah. Jika pendapatan berubah-ubah, evaluasi kemampuan menabung setiap kali menerima pemasukan."
                ]
        },
        {
                "id": "pisahkan-tabungan",
                "title": "3. Pisahkan tabungan dari uang belanja",
                "paragraphs": [
                        "Pemisahan membantu kamu mengetahui uang yang tersedia untuk belanja sehari-hari. Beri nama tujuan pada catatan tabungan agar perkembangannya mudah dipahami."
                ],
                "points": [
                        "Tentukan jadwal untuk menyisihkan uang.",
                        "Catat setiap setoran dan penarikan.",
                        "Periksa biaya layanan jika memakai rekening terpisah."
                ]
        },
        {
                "id": "tinjau-kemajuan",
                "title": "4. Tinjau kemajuan setiap bulan",
                "paragraphs": [
                        "Bandingkan jumlah yang terkumpul dengan rencana awal. Jika ada kebutuhan mendesak, catat perubahan target agar rencananya tetap masuk akal.",
                        "Saat pengeluaran tertentu berkurang, kamu bisa mempertimbangkan menambah setoran sesuai kemampuan. Jadikan evaluasi sebagai kebiasaan, bukan alasan untuk merasa tertinggal."
                ]
        }
],
      status: "PUBLISHED",
      publishedAt: "2026-11-04T04:42:15.951435Z",
      readingTimeMinutes: 3,
      createdAt: "2026-11-04T04:42:15.956475Z",
      updatedAt: "2026-11-04T04:42:15.956475Z",
    },
    {
      id: "641f8555-4d0a-4c0f-81b4-a0a3ec7e9202",
      authorId: "9313c428-17ed-4045-8c13-ca7354a55733",
      title: "Mengenal Investasi untuk Pemula",
      slug: "mengenal-investasi-untuk-pemula",
      heroImage: blogImage3.src,
      excerpt: "Kenali pilihan investasi dan pahami risikonya sebelum mulai berinvestasi.",
      introduction: "Istilah investasi sering muncul ketika membicarakan tujuan keuangan jangka panjang. Sebelum memilih produk, luangkan waktu untuk memahami cara kerjanya, biaya yang muncul, dan kemungkinan kerugian yang perlu dipertimbangkan.",
      sections: [
        {
                "id": "tentukan-tujuan-investasi",
                "title": "1. Mulai dari tujuan dan jangka waktu",
                "paragraphs": [
                        "Tuliskan tujuan penggunaan uang dan perkiraan kapan kamu membutuhkannya. Dana untuk kebutuhan dekat memerlukan pertimbangan berbeda dari dana untuk rencana jangka panjang.",
                        "Pisahkan kebutuhan rutin dari dana yang sedang dipelajari untuk investasi. Jangan mendasarkan keputusan hanya pada cerita hasil yang diperoleh orang lain."
                ]
        },
        {
                "id": "pahami-risiko",
                "title": "2. Pahami risiko sebelum melihat potensi hasil",
                "paragraphs": [
                        "Nilai investasi dapat berubah dan hasil tidak selalu sesuai harapan. Angka kinerja masa lalu juga tidak menjamin hasil yang sama di masa depan.",
                        "Pelajari sumber risiko produk, kapan dana dapat dicairkan, serta kemungkinan biaya atau pembatasan pencairan. Jika penjelasannya belum dipahami, lanjutkan belajar sebelum mengambil keputusan."
                ]
        },
        {
                "id": "baca-informasi",
                "title": "3. Baca informasi produk dengan teliti",
                "paragraphs": [
                        "Gunakan dokumen resmi penyedia produk untuk memeriksa cara kerja, biaya, dan ketentuannya. Periksa juga status penyedia melalui kanal resmi otoritas yang relevan sebelum menggunakan layanannya."
                ],
                "points": [
                        "Apa yang menjadi dasar nilai produk?",
                        "Biaya apa saja yang akan dikenakan?",
                        "Bagaimana proses pencairan dan berapa lama waktunya?",
                        "Apa yang terjadi jika nilainya turun?"
                ]
        },
        {
                "id": "catat-dan-tinjau",
                "title": "4. Catat keputusan dan evaluasi berkala",
                "paragraphs": [
                        "Simpan alasan memilih produk, tujuan, dan biaya yang dikeluarkan. Catatan membantu kamu menilai keputusan berdasarkan rencana, bukan sekadar perubahan harga harian.",
                        "Artikel ini merupakan pengenalan umum. Luangkan waktu untuk mempelajari produk yang dipertimbangkan dan menilai kesesuaiannya dengan kebutuhan serta kemampuanmu sendiri."
                ]
        }
],
      status: "PUBLISHED",
      publishedAt: "2026-11-03T04:42:15.951435Z",
      readingTimeMinutes: 3,
      createdAt: "2026-11-03T04:42:15.956475Z",
      updatedAt: "2026-11-03T04:42:15.956475Z",
    },

  ],
  paging: { skip: 0, limit: 20, totalItem: 3, hasMore: false },
};

// Metadata tampilan dummy, terpisah karena respons artikel hanya memuat authorId.
export const dummyBlogAuthors: Record<string, string> = {
  "9313c428-17ed-4045-8c13-ca7354a55733": "Tim MyArtoku",
};

export const dummyBlogPostCategories: Record<string, string> = {
  "9ea07e6b-4f6b-40e8-b303-219cca41d80b": "budgeting",
  "f268548c-465b-4ba9-ae32-739de8a32d01": "tabungan",
  "641f8555-4d0a-4c0f-81b4-a0a3ec7e9202": "investasi",
};
