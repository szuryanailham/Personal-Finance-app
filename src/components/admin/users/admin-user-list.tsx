"use client";

import { useState } from "react";
import { BlogAuth } from "@/components/admin/blogs/blog-auth";
import { ADMIN_USERS_PAGE_SIZE } from "@/lib/api/admin/users";
import { useAdminUsers } from "@/hooks/admin/use-admin-users";
import type { BlogSession } from "@/types/admin/blog-category";

const button = "min-h-10 cursor-pointer rounded border border-[#2271b1] px-3 py-2 text-sm text-[#2271b1] hover:bg-[#f0f6fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1] disabled:cursor-not-allowed disabled:opacity-50";
const number = new Intl.NumberFormat("id-ID");

export function AdminUserList() {
  return <BlogAuth>{(session, onExpired) => session.user.roles.includes("ADMIN")
    ? <UserTable session={session} onExpired={onExpired} />
    : <p role="alert" className="mt-6 border-l-4 border-amber-500 bg-white p-4 text-sm">Daftar pengguna hanya dapat diakses oleh akun dengan peran ADMIN.</p>}
  </BlogAuth>;
}

function UserTable({ session, onExpired }: { session: BlogSession; onExpired: () => void }) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(ADMIN_USERS_PAGE_SIZE);
  const { users, paging, isLoading, error, unauthorized, reload } = useAdminUsers(session.token, page, size);
  return <section aria-label="Daftar pengguna aplikasi" className="mt-6 min-w-0" aria-busy={isLoading}>
    {isLoading ? <p role="status" className="border border-[#c3c4c7] bg-white p-6 text-sm">Memuat pengguna...</p> : error ? (
      <div role="alert" className="space-y-3 border border-red-300 bg-white p-4 text-sm">
        <p>{error}</p>
        <button type="button" onClick={unauthorized ? onExpired : reload} className={button}>{unauthorized ? "Masuk kembali" : "Coba lagi"}</button>
      </div>
    ) : <>
      <div className="overflow-x-auto rounded border border-[#c3c4c7] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Pengguna terdaftar aplikasi keuangan dan jumlah transaksi mereka</caption>
          <thead className="border-b border-[#c3c4c7]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Nama</th>
              <th scope="col" className="px-4 py-3 font-medium">Email</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Total transaksi</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Transaksi aktif</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => <tr key={user.id} className="border-b border-[#dcdcde] align-top last:border-0 odd:bg-[#f6f7f7]">
              <td className="max-w-64 break-words px-4 py-3 font-medium">{[user.firstName, user.lastName].map(part => part?.trim()).filter(Boolean).join(" ") || "—"}</td>
              <td className="max-w-80 break-all px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 text-right tabular-nums">{number.format(user.transactionCount)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{number.format(user.activeTransactionCount)}</td>
            </tr>)}
            {users.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#646970]">{page === 0 ? "Belum ada pengguna terdaftar." : "Tidak ada pengguna pada halaman ini."}</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#646970]">Total transaksi mencakup transaksi yang dihapus sementara. Transaksi aktif hanya menghitung transaksi yang tidak dihapus.</p>
    </>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p role="status">{!isLoading && !error ? `${number.format(paging?.totalItem ?? users.length)} pengguna · Halaman ${page + 1} dari ${Math.max(1, paging?.totalPage ?? 1)}` : `Halaman ${page + 1}`}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="admin-users-page-size" className="flex items-center gap-2">
          Per halaman
          <select id="admin-users-page-size" value={size} disabled={isLoading || unauthorized}
            onChange={event => { setSize(Number(event.target.value)); setPage(0); }}
            className="min-h-10 rounded border border-[#8c8f94] bg-white px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1] disabled:opacity-50">
            {[15, 50, 100].map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      <nav aria-label="Navigasi halaman pengguna" className="flex gap-2">
        <button type="button" disabled={isLoading || unauthorized || page === 0} onClick={() => setPage(value => value - 1)} className={button}>Sebelumnya</button>
        <button type="button" disabled={isLoading || !!error || page + 1 >= (paging?.totalPage ?? 1)} onClick={() => setPage(value => value + 1)} className={button}>Berikutnya</button>
      </nav>
      </div>
    </div>
  </section>;
}
