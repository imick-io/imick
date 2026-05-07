const MIN_LENGTH = 500;
const MAX_LENGTH = 10_000;

export async function extractPageText(
  url: string
): Promise<string | null> {
  let html: string;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    html = await response.text();
  } catch {
    return null;
  }

  let text = html;
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  if (text.length < MIN_LENGTH) return null;
  return text.slice(0, MAX_LENGTH);
}
