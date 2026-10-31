"use client"

import { BookOpenIcon, PlayIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TUTORIALS, type TutorialId } from "@/lib/guidance/tutorials"
import { useGuidance } from "./guidance-provider"

export function GuidanceCenter() {
  const { startTutorial, busy } = useGuidance()
  return (
    <section className="mx-auto w-full max-w-5xl py-4">
      <div className="mb-6 flex items-start gap-3">
        <BookOpenIcon className="mt-1 size-6 shrink-0 text-[#14864A]" aria-hidden />
        <div>
          <h2 className="text-xl font-semibold">Belajar mengelola keuangan dengan Artoku</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Pilih tutorial untuk mencoba fitur Artoku. Semua panduan bisa diputar ulang kapan saja.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(TUTORIALS) as TutorialId[]).map((id) => {
          const tutorial = TUTORIALS[id]
          return (
            <article key={id} className="flex flex-col gap-3 rounded-2xl border bg-card p-5 text-card-foreground">
              <h3 className="font-semibold">{tutorial.title}</h3>
              <p className="flex-1 text-sm leading-6 text-muted-foreground">{tutorial.description}</p>
              <Button disabled={busy} onClick={() => startTutorial(id)} className="mt-2 w-fit bg-[#14864A] text-white hover:bg-[#10733e]" aria-label={`Mulai tutorial ${tutorial.title}`}>
                <PlayIcon className="size-4" aria-hidden /> Mulai tutorial
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
