import { describe, expect, it } from "vitest"
import { isDatabaseUnavailable } from "./db-availability"

// Mirrors the shape drizzle throws: a wrapper Error whose `cause` is the
// NeonDbError. The 402 body is the one production returned when the project
// went over quota.
function neonFailure(message: string, code?: string) {
  const cause = new Error(message)
  if (code !== undefined) Object.assign(cause, { code })
  return Object.assign(new Error("Failed query: select 1"), { cause })
}

describe("isDatabaseUnavailable", () => {
  it("treats an over-quota 402 as unavailable", () => {
    const error = neonFailure(
      'Server error (HTTP status 402): {"message":"Your account or project has exceeded the quota."}'
    )
    expect(isDatabaseUnavailable(error)).toBe(true)
  })

  it("treats rate limiting and endpoint outages as unavailable", () => {
    expect(isDatabaseUnavailable(neonFailure("Server error (HTTP status 429)"))).toBe(true)
    expect(isDatabaseUnavailable(neonFailure("Server error (HTTP status 503)"))).toBe(true)
  })

  it("treats network failures as unavailable", () => {
    expect(isDatabaseUnavailable(neonFailure("fetch failed"))).toBe(true)
    expect(isDatabaseUnavailable(neonFailure("connect ECONNREFUSED 127.0.0.1:5432"))).toBe(true)
  })

  it("treats Neon's connection failure message as unavailable", () => {
    expect(
      isDatabaseUnavailable(
        neonFailure("Error connecting to database: TypeError: fetch failed")
      )
    ).toBe(true)
  })

  it("does not hide a real query bug behind an outage", () => {
    // SQLSTATE 42703 = undefined_column. Postgres answered, so this is our bug.
    const error = neonFailure('column "nope" does not exist', "42703")
    expect(isDatabaseUnavailable(error)).toBe(false)
  })

  it("does not treat an arbitrary error as unavailable", () => {
    expect(isDatabaseUnavailable(new Error("boom"))).toBe(false)
    expect(isDatabaseUnavailable(undefined)).toBe(false)
  })
})
