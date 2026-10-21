"use client"

import { CATEGORY_COLORS } from "@/components/chart/expense-category-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UseCategoryStatisticResult } from "@/hooks/use-category-statistic"

const currencyFormatter = new Intl.NumberFormat("id-ID")

function StatusRow({ message, className }: { message: string; className: string }) {
  return (
    <TableRow>
      <TableCell colSpan={4} className={`h-24 text-center ${className}`}>
        {message}
      </TableCell>
    </TableRow>
  )
}

export function CategoryStatisticTable({ statistic, isLoading, error }: UseCategoryStatisticResult) {
  const categories = statistic?.categories ?? []
  const totalTransactions = categories.reduce((sum, item) => sum + item.transactionCount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semua Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Transaksi</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="text-right">Persentase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <StatusRow message={error} className="text-destructive" />
            ) : isLoading && !statistic ? (
              <StatusRow message="Memuat statistik..." className="text-muted-foreground" />
            ) : categories.length === 0 ? (
              <StatusRow message="Belum ada pengeluaran pada periode ini" className="text-muted-foreground" />
            ) : (
              categories.map((item, index) => (
                <TableRow key={item.categoryId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {/* Warna sama dengan urutan slice di pie chart */}
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                      />
                      {item.categoryName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.transactionCount}</TableCell>
                  <TableCell className="text-right">Rp {currencyFormatter.format(item.totalAmount)}</TableCell>
                  <TableCell className="text-right">{item.percentage}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {statistic && categories.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalTransactions}</TableCell>
                <TableCell className="text-right">Rp {currencyFormatter.format(statistic.totalExpense)}</TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
