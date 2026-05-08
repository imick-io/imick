const MIN_LENGTH = 500;
const MAX_LENGTH = 10_000;

export async function extractPageText(
  url: string
): Promise<string | null> {
  let html: string;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("[extractPageText] non-OK response", { url, status: response.status });
      return null;
    }
    html = await response.text();
  } catch (err) {
    console.warn("[extractPageText] fetch threw", { url, error: err instanceof Error ? err.message : String(err) });
    return null;
  }

  let text = html;
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  if (text.length < MIN_LENGTH) {
    console.warn("[extractPageText] text below MIN_LENGTH", { url, length: text.length, minLength: MIN_LENGTH });
    return null;
  }
  return text.slice(0, MAX_LENGTH);
}
