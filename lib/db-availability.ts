// Neon answers with an HTTP status instead of a SQL error when the project
// itself cannot serve the query: 402 when the account is over quota, 429 when
// it is rate limited, 5xx when the endpoint is down. Those are operational
// states, not defects in the calling page, so the site should degrade to a
// maintenance notice rather than a 500.
//
// A genuine query bug (bad column, syntax error) comes back as a real Postgres
// error carrying a SQLSTATE. Those must keep throwing, otherwise a broken query
// would masquerade as an outage and hide itself behind a friendly page.

const NETWORK_FAILURE =
  /error connecting to database|fetch failed|ECONNREFUSED|ECONNRESET|ENOTFOUND|ETIMEDOUT|socket hang up|connection terminated|network/i

function causeChain(error: unknown): unknown[] {
  const chain: unknown[] = []
  let current = error
  while (current && chain.length < 10) {
    chain.push(current)
    current = (current as { cause?: unknown }).cause
  }
  return chain
}

export function isDatabaseUnavailable(error: unknown): boolean {
  return causeChain(error).some((link) => {
    if (!(link instanceof Error)) return false
    // A SQLSTATE means Postgres understood the query and rejected it. That is
    // our bug to fix, not an outage to wait out.
    const sqlState = (link as { code?: unknown }).code
    if (typeof sqlState === "string" && sqlState.length > 0) return false
    return /HTTP status \d{3}/.test(link.message) || NETWORK_FAILURE.test(link.message)
  })
}

export type Availability<T> = { ok: true; data: T } | { ok: false }

// Runs a read and reports unavailability instead of throwing, so a page can
// render a maintenance state. Only use this for reads a page can live without.
export async function readWhenAvailable<T>(
  read: () => Promise<T>
): Promise<Availability<T>> {
  try {
    return { ok: true, data: await read() }
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error
    console.error("[db] unavailable, degrading to maintenance state", error)
    return { ok: false }
  }
}
