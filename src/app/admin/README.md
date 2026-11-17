# Struktur dashboard admin

Folder admin mengikuti pemisahan route, komponen, hooks, API, dan tipe yang digunakan proyek.

```text
src/
├── app/admin/
│   ├── README.md
│   └── dashboard/             # Halaman /admin/dashboard
├── components/admin/
│   ├── layout/                # Shell, sidebar, dan header admin
│   └── dashboard/             # Komponen ringkasan dashboard admin
├── hooks/admin/               # Hooks khusus admin
├── lib/api/admin/             # Fungsi pemanggilan API admin
└── types/admin/               # Tipe request, response, dan model admin
```

## Aturan penempatan

- Tambahkan `app/admin/layout.tsx` untuk layout bersama seluruh halaman admin.
- `app/admin/dashboard/page.tsx` menyediakan halaman awal kosong di `/admin/dashboard`.
- Simpan komponen tampilan di `components/admin`, dengan subfolder sesuai fitur.
- Simpan hooks admin di `hooks/admin` dan pemanggilan API di `lib/api/admin`; gunakan client HTTP proyek dari `@/lib/api/client`.
- Simpan tipe bersama khusus admin di `types/admin`. Tipe yang hanya dipakai satu file dapat tetap berada di file tersebut.
- Gunakan komponen umum dari `components/ui` untuk kebutuhan UI bersama.
- Tambahkan pemeriksaan sesi dan role admin di server saat mengimplementasikan halaman; prefix URL `/admin` sendiri tidak membatasi akses. Endpoint backend juga harus memvalidasi izin admin.

Layout admin menggunakan sidebar sederhana berisi Home, Users, Blogs, dan Kategori Blog dengan warna gelap bergaya WordPress. Sidebar menampilkan ikon saja di layar kecil. Daftar artikel Blogs masih memakai data contoh; kategori blog sudah terintegrasi dengan API. Seluruh halaman admin dilindungi pemeriksaan sesi backend pada layout server; login tersedia di `/admin/login`. File `.gitkeep` menjaga folder kosong tetap tersimpan di Git dan dapat dihapus setelah folder memiliki implementasi.


## Kategori blog

- Buka `/admin/blogs/categories` melalui menu Kategori Blog di sidebar atau tombol pada `/admin/blogs`.
- Data menggunakan `/api/blog/categories` melalui API client dan proxy Next.js (default backend `http://localhost:8080`). Tidak memakai kategori contoh.
- Login terpisah di `/admin/login`. Akses `/admin` dan seluruh subhalaman memerlukan sesi blog yang divalidasi melalui `/api/blog/auth/me`; `/admin` mengarah ke dashboard setelah login.
- Backend blog memiliki akun dan sesi tersendiri: masuk melalui panel akun blog menggunakan akun yang sudah dibuat di backend. Login memakai `/api/blog/auth/login`, validasi sesi `/api/blog/auth/me`, dan logout `/api/blog/auth/logout`.
- Login menggunakan Server Action yang memanggil backend dan menyimpan sesi pada cookie HttpOnly terpisah dari akun keuangan. Password tidak disimpan. Logout menghapus cookie dan memanggil backend. Sesi sessionStorage lama tidak digunakan lagi.
- Daftar memakai pencarian server dan pagination `page` mulai 0, `size=20`. ADMIN/EDITOR dapat menambah, mengedit, dan menghapus; izin tetap divalidasi backend. Penghapusan meminta konfirmasi dan menampilkan error backend jika kategori masih dipakai artikel atau slug duplikat saat penyimpanan.
- Nama maksimal 100 karakter, slug maksimal 150 dengan format `tips-keuangan`, dan deskripsi opsional maksimal 10000 karakter.
- Jalankan tes kontrak API dan isolasi sesi dengan `node --test tests/blog-categories.test.cjs`.

- Slug kategori terisi otomatis dari nama (huruf kecil, spasi/tanda baca menjadi `-`). Duplikat memakai suffix `-2`, `-3`, dan seterusnya, diperiksa melalui seluruh halaman hasil pencarian API serta diperiksa ulang saat disimpan. Saat edit, slug lama dipertahankan sampai nama diubah; kategori itu sendiri tidak dianggap duplikat.

## Tags blog

- Menu Tags tersedia di `/admin/blogs/tags` dengan sesi admin yang sama.
- Daftar, pencarian, pagination, tambah, edit, dan hapus menggunakan `/api/blog/tags` melalui proxy backend.
- Form mengirim hanya `name` (maksimal 100 karakter) dan `slug` (maksimal 150 karakter). Tag tidak memiliki deskripsi.
- Slug otomatis dari nama; slug duplikat mendapat suffix angka. Pencarian slug mencakup semua halaman hasil API dan mengabaikan tag yang sedang diedit.
- ADMIN/EDITOR dapat mengubah data. Hapus meminta konfirmasi; error izin atau tag yang masih dipakai artikel ditampilkan dari backend. Notifikasi sukses berwarna hijau dan dapat ditutup.
