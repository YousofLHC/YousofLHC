const VIDEO_RE = /\.(mp4|webm|m4v)$/i;

/**
 * Renders any cover format: images via <img>, video files as a muted
 * looping <video>. Falls back to a gradient tile when src is empty.
 */
export function CoverMedia({
  src,
  alt = "",
  className = "h-full w-full object-cover",
  videoClassName = "h-full w-full object-cover",
}: {
  src?: string;
  alt?: string;
  className?: string;
  videoClassName?: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={`bg-gradient-to-br from-panel-2 via-panel to-abyss ${className}`}
      />
    );
  }
  if (VIDEO_RE.test(src)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={videoClassName}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
}
