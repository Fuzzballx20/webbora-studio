import { ReactNode } from "react";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  rotate?: number;
  className?: string;
  showTape?: boolean;
  tapeOffset?: number;
  aspect?: string;
}

export function Polaroid({
  src,
  alt,
  caption,
  rotate = -2,
  className = "",
  showTape = true,
  tapeOffset = 0,
  aspect = "aspect-[4/5]",
}: PolaroidProps) {
  return (
    <figure
      className={`scrapbook rounded-md ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {showTape && (
        <span
          className="tape rounded-sm"
          style={{
            top: -10,
            left: `calc(50% - 45px + ${tapeOffset}px)`,
            transform: `rotate(${-rotate * 1.5}deg)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className={`overflow-hidden rounded-sm ${aspect}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      {caption && (
        <figcaption className="handwritten mt-3 text-center text-xl text-cocoa/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
