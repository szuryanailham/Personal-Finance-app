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
