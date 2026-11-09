import Image, { type StaticImageData } from "next/image";

type FeatureDetailProps = {
  id: string;
  image: StaticImageData;
  imageAlt: string;
  title: string;
  description: string;
  reverse?: boolean;
};

export function FeatureDetail({
  id,
  image,
  imageAlt,
  title,
  description,
  reverse = false,
}: FeatureDetailProps) {
  return (
    <article
      aria-labelledby={`${id}-title`}
      className={`flex flex-col items-center gap-8 md:gap-10 lg:gap-20 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div className="flex w-full justify-center md:min-w-0 md:flex-1">
        <Image
          src={image}
          alt={imageAlt}
          width={479}
          height={615}
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 767px) 479px, (max-width: 1023px) calc((100vw - 104px) / 2), 479px"
          className="h-auto w-full max-w-[479px] rounded-3xl object-contain transition-transform duration-300 ease-out motion-safe:hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="w-full md:min-w-0 md:flex-1">
        <h3 id={`${id}-title`} className="text-2xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          {title}
        </h3>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>
    </article>
  );
}
