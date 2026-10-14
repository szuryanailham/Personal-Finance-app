import Image from "next/image"
import Link from "next/link"
import notFoundIllustration from "@/components/images/illustrations/not-found.svg"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageStatusProps {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  className?: string
}


export function PageStatus({
  title,
  description,
  actionHref = "/dashboard",
  actionLabel = "Kembali ke Dashboard",
  className,
}: PageStatusProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-4 py-12 text-center",
        className
      )}
    >
      <Image
        src={notFoundIllustration}
        alt=""
        aria-hidden="true"
        priority
        className="h-auto w-full max-w-xs"
      />
      <div className="flex max-w-md flex-col gap-2">r
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Link
        href={actionHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "border-[#6359E9] px-6 text-[#6359E9] hover:bg-[#6359E9]/10 hover:text-[#6359E9]"
        )}
      >
        {actionLabel}
      </Link>
    </div>
  )
}

export function UnderDevelopment({ feature }: { feature?: string }) {
  return (
    <PageStatus
      title="Sedang Dalam Pengembangan"
      description={`${feature ?? "Halaman ini"} sedang kami siapkan. Silakan kembali lagi nanti.`}
    />
  )
}
