export interface TutorialStep {
  path: string
  target?: string
  mobilePath?: string
  mobileTarget?: string
  title: string
  description: string
}

const category: TutorialStep = {
  path: "/category", target: "category",
  title: "Buat kategori transaksi",
  description: "Mulai dengan membuat kategori transaksi agar pemasukan dan pengeluaranmu lebih terorganisir. Isi nama dan jenis kategori, lalu simpan. Kategori yang sudah dibuat dapat dikelola di daftar kategori.",
}
const transaction: TutorialStep = {
  path: "/dashboard", target: "add-transaction",
  title: "Catat pemasukan dan pengeluaran",
  description: "Catat pemasukan dan pengeluaranmu untuk mulai memahami ke mana uangmu digunakan. Pilih Tambah Baru, lalu Tambah Transaksi. Di ponsel, gunakan tombol +. Isi kategori, nominal, dan tanggal, lalu simpan.",
}
const summary: TutorialStep = {
  path: "/dashboard", target: "summary",
  title: "Pahami kondisi keuanganmu",
  description: "Pantau kondisi keuanganmu melalui ringkasan saldo dan aktivitas keuangan. Lihat pemasukan, pengeluaran, serta tabungan. Di ponsel, geser kartu untuk melihat ringkasan lainnya.",
}
const analysis: TutorialStep = {
  path: "/analysis", target: "spending",
  title: "Kenali pola pengeluaran",
  description: "Lihat distribusi pengeluaran berdasarkan kategori untuk mengetahui ke mana uangmu paling banyak digunakan. Gunakan filter periode dan tabel kategori untuk meninjau rincian pengeluaran.",
}
const calendar: TutorialStep = {
  path: "/calender", target: "calendar",
  title: "Tinjau transaksi berdasarkan tanggal",
  description: "Gunakan kalender untuk melihat dan meninjau transaksi berdasarkan tanggal. Pindah bulan dengan tombol panah, lalu pilih tanggal untuk melihat rincian transaksinya.",
}
const completion: TutorialStep = {
  path: "/dashboard",
  title: "Selamat!",
  description: "Selamat! Kamu sudah mengenal fitur utama Artoku. Sekarang saatnya mulai mengelola keuanganmu.",
}

export const TUTORIALS = {
  initial: {
    title: "Mulai menggunakan Artoku",
    description: "Kenali lima fitur utama, mulai dari kategori hingga kalender transaksi.",
    steps: [category, transaction, summary, analysis, calendar, completion],
  },
  category: {
    title: "Kelola kategori", description: "Buat dan kelola kategori pemasukan, pengeluaran, serta tabungan.",
    steps: [category],
  },
  transaction: {
    title: "Kelola transaksi", description: "Pelajari cara mencatat dan meninjau transaksi.",
    steps: [transaction, {
      path: "/transaction", target: "transaction-history",
      title: "Riwayat transaksi",
      description: "Cari transaksi dan gunakan filter untuk meninjau catatanmu. Pilih transaksi untuk melihat rincian, mengedit, atau menghapusnya.",
    }],
  },
  summary: {
    title: "Ringkasan keuangan", description: "Pahami saldo, pemasukan, pengeluaran, dan tabunganmu.",
    steps: [summary],
  },
  analysis: {
    title: "Analisis pengeluaran", description: "Kenali distribusi pengeluaran per kategori.",
    steps: [analysis],
  },
  summaryFilter: {
    title: "Filter Summary (Ringkasan)",
    description: "Sesuaikan periode saldo, pemasukan, pengeluaran, dan tabungan pada ringkasan.",
    steps: [{
      path: "/dashboard", target: "summary-filter",
      title: "Pilih periode ringkasan",
      description: "Klik ikon Filter di header Dashboard. Pilih Tahunan, Bulanan, atau Mingguan untuk menampilkan ringkasan periode tersebut. Di ponsel, gunakan ikon Filter di bagian atas halaman.",
    }, {
      path: "/dashboard", target: "summary-filter",
      title: "Gunakan rentang tanggal sendiri",
      description: "Pilih Atur Sendiri, lalu isi Tanggal mulai dan Tanggal akhir. Tanggal akhir harus sama atau setelah tanggal mulai. Klik Terapkan Filter (Terapkan di ponsel), lalu periksa perubahan kartu ringkasan. Gunakan Batal untuk menutup tanpa menerapkan pilihan. Untuk kembali ke periode bulanan, buka filter dan terapkan Bulanan.",
    }],
  },
  transactionFilter: {
    title: "Filter Transaksi",
    description: "Temukan transaksi berdasarkan kategori, jenis, tanggal, dan urutan data.",
    steps: [{
      path: "/transaction", target: "transaction-filter",
      title: "Saring daftar transaksi",
      description: "Buka halaman Transaksi dan klik ikon Filter di dekat pencarian. Pilih kategori dan jenis transaksi: Semua, Income (pemasukan), Expense (pengeluaran), atau Saving (tabungan). Gabungkan pilihan ini untuk mempersempit daftar transaksi.",
    }, {
      path: "/transaction", target: "transaction-filter",
      title: "Atur tanggal dan urutan",
      description: "Pilih Kapan saja, Hari Ini, 7 hari terakhir, 14 hari terakhir, atau Rentang sendiri. Untuk rentang sendiri, isi tanggal mulai dan akhir yang valid. Pilih urutan Terbaru, Terlama, Jumlah tertinggi/terendah, atau Nama A–Z/Z–A, lalu terapkan filter. Jika hasil kosong, perluas tanggal atau pilih semua kategori dan jenis transaksi.",
    }],
  },
  analysisFilter: {
    title: "Filter Analisis",
    description: "Tinjau grafik dan rincian pengeluaran kategori pada periode yang dipilih.",
    steps: [{
      path: "/analysis", target: "analysis-filter",
      title: "Pilih periode analisis",
      description: "Buka halaman Analisis, lalu klik ikon Filter periode pada bagian analisis kategori. Pilih Hari Ini, Minggu Ini (Senin–Minggu), Bulan Ini, atau Tahun Ini sesuai periode pengeluaran yang ingin ditinjau.",
    }, {
      path: "/analysis", target: "analysis-filter",
      title: "Terapkan rentang analisis",
      description: "Untuk periode khusus, pilih Atur Sendiri dan isi tanggal mulai serta tanggal akhir. Pastikan tanggal akhir sama atau setelah tanggal mulai, lalu terapkan pilihan. Grafik dan tabel kategori akan mengikuti periode tersebut. Jika tidak ada pengeluaran, coba perluas rentang tanggal. Buka kembali filter untuk mengganti periode.",
    }],
  },
  calendar: {
    title: "Kalender dan riwayat transaksi", description: "Tinjau transaksi pada tanggal dan periode tertentu.",
    steps: [calendar],
  },
  transfer: {
    title: "Import dan export transaksi", description: "Pelajari cara mengunggah catatan dan mengunduh transaksi.",
    steps: [{
      path: "/dashboard", target: "import", mobilePath: "/import", mobileTarget: "import-form",
      title: "Import transaksi",
      description: "Gunakan Import untuk mengunggah file CSV atau XLSX. Siapkan kategori dan gunakan template Artoku, lalu periksa hasil import sebelum menyimpan transaksi.",
    }, {
      path: "/dashboard", target: "export", mobilePath: "/export", mobileTarget: "export-form",
      title: "Export transaksi",
      description: "Gunakan Export untuk mengunduh transaksi. Pilih format file dan rentang transaksi, lalu unduh sebagai arsip keuanganmu.",
    }],
  },
} satisfies Record<string, { title: string; description: string; steps: TutorialStep[] }>

export type TutorialId = keyof typeof TUTORIALS
