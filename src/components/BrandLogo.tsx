import { useState } from 'react'

/*
  Renders a brand logo image with a graceful text fallback if the asset is missing.
  Replace files in /public/assets/logos to update branding.
*/
interface BrandLogoProps {
  src: string
  alt: string
  fallback: string
  className?: string
}

export default function BrandLogo({ src, alt, fallback, className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={`font-display font-bold tracking-widest text-white ${className ?? ''}`}
      >
        {fallback}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      draggable={false}
    />
  )
}
