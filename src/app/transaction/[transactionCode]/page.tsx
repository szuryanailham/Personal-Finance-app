import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"
import { TransactionDetail } from "@/components/transaction/transaction-detail"

// Versi desktop; versi mobile dirender lewat MobileTransactionRoutes di layout
export default async function TransactionDetailPage({ params }: PageProps<"/transaction/[transactionCode]">) {
  const { transactionCode } = await params

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-8">
      <Link href="/transaction" className="flex w-fit items-center gap-1 text-sm font-medium text-[#6359E9]">
        <ChevronLeftIcon className="size-4" />
        Kembali ke Transaksi
      </Link>
      <TransactionDetail transactionCode={decodeURIComponent(transactionCode)} />
    </div>
  )
}
