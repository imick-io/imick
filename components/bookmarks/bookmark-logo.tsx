"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getHostname } from "@/lib/bookmarks-meta"

interface Props {
  logoUrl: string | null
  url: string
  colorHex?: string | null
  size: number
  rounded?: string
  className?: string
}

function isLightHex(hex: string): boolean {
  const cleaned = hex.replace("#", "")
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned
  if (expanded.length !== 6) return false
  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return false
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128
}

export function BookmarkLogo({
  logoUrl,
  url,
  colorHex,
  size,
  rounded = "rounded-md",
  className,
}: Props) {
  const [errored, setErrored] = useState(false)
  const dimension = { width: size, height: size }

  if (logoUrl && !errored) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        unoptimized
        onError={() => setErrored(true)}
        className={cn(
          "shrink-0 border border-border bg-background object-contain",
          rounded,
          className
        )}
        style={dimension}
      />
    )
  }

  const initial = getHostname(url).charAt(0).toUpperCase() || "?"
  const validHex = !!colorHex && /^#[0-9a-f]{3,6}$/i.test(colorHex)
  const fontSize = Math.round(size * 0.5)

  if (validHex) {
    const light = isLightHex(colorHex!)
    return (
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center font-semibold leading-none",
          rounded,
          className
        )}
        style={{
          ...dimension,
          backgroundColor: colorHex!,
          color: light ? "#111111" : "#ffffff",
          fontSize,
        }}
      >
        {initial}
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center bg-zinc-900 font-semibold leading-none text-zinc-50",
        rounded,
        className
      )}
      style={{ ...dimension, fontSize }}
    >
      {initial}
    </div>
  )
}
