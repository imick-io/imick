export interface MicrolinkData {
  title: string
  description: string | null
  logoUrl: string | null
  imageUrl: string | null
  colorHex: string | null
}

export async function fetchMicrolink(url: string): Promise<MicrolinkData> {
  const fallback: MicrolinkData = {
    title: new URL(url).hostname,
    description: null,
    logoUrl: null,
    imageUrl: null,
    colorHex: null,
  }

  try {
    const apiUrl = new URL("https://api.microlink.io")
    apiUrl.searchParams.set("url", url)
    apiUrl.searchParams.set("palette", "true")

    const apiKey = process.env.MICROLINK_API_KEY
    const headers: HeadersInit = { Accept: "application/json" }
    if (apiKey) headers["x-api-key"] = apiKey

    const res = await fetch(apiUrl.toString(), { headers, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return fallback

    const json = await res.json()
    const data = json?.data

    const palette = data?.palette as Record<string, string> | undefined
    const dominant =
      palette?.["vibrant"] ??
      palette?.["dominant"] ??
      palette?.["darkVibrant"] ??
      null

    return {
      title: data?.title ?? fallback.title,
      description: data?.description ?? null,
      logoUrl: data?.logo?.url ?? null,
      imageUrl: data?.screenshot?.url ?? data?.image?.url ?? null,
      colorHex: dominant ?? null,
    }
  } catch {
    return fallback
  }
}
