import { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { ASSETS } from "@/data/whiterock";
import { cn } from "@/lib/utils";
import { BgVideo } from "@/components/layout/BgVideo";

type PageHeroProps = {
  eyebrow?: { id: string; en: string; ru?: string; ko?: string };
  title: { id: string; en: string; ru?: string; ko?: string };
  subtitle?: { id: string; en: string; ru?: string; ko?: string };
  children?: ReactNode;
  bgImage?: string;
  /** Use the brand bg-video instead of a static image */
  video?: boolean;
  align?: "center" | "left";
  height?: "tall" | "short";
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  bgImage,
  video,
  align = "center",
  height = "tall",
  className,
}: PageHeroProps) {
  const { tf } = useLang();
  const isCenter = align === "center";
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden flex items-center ambient",
        height === "tall" ? "min-h-[78vh]" : "min-h-[52vh]",
        className
      )}
    >
      {/* Background layer */}
      {video ? (
        <BgVideo className="opacity-50" poster={ASSETS.aerial} />
      ) : bgImage ? (
        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      ) : null}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%/0.7)] via-[hsl(222_47%_6%/0.55)] to-[hsl(222_47%_6%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,transparent,rgba(0,0,0,0.5))]" />

      <div
        className={cn(
          "relative z-10 container mx-auto px-5 md:px-8",
          isCenter ? "text-center mx-auto max-w-4xl" : "text-left max-w-3xl"
        )}
      >
        {eyebrow && (
          <span
            className={cn(
              "inline-block text-xs font-semibold uppercase tracking-[0.35em] mb-5",
              "text-amber-300/90"
            )}
          >
            {tf(eyebrow)}
          </span>
        )}
        <h1
          className={cn(
            "font-cinzel font-bold tracking-wide leading-[1.05]",
            "text-4xl sm:text-6xl md:text-7xl",
            "text-slate-50 text-glow-gold"
          )}
        >
          {tf(title)}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-6 text-base md:text-xl font-light leading-relaxed text-slate-200/85",
              isCenter ? "mx-auto max-w-2xl" : ""
            )}
          >
            {tf(subtitle)}
          </p>
        )}
        {children && <div className={cn("mt-10", isCenter ? "flex justify-center" : "")}>{children}</div>}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-300/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">{tf({ id: "Gulir", en: "Scroll", ru: "Прокрутите", ko: "스크롤" })}</span>
        <div className="h-10 w-px bg-gradient-to-b from-amber-300/60 to-transparent" />
      </div>
    </section>
  );
}
