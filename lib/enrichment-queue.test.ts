import { describe, it, expect } from "vitest"
import { selectDrainable, type DrainableRow } from "./enrichment-queue"

const NOW = new Date("2026-08-21T12:00:00Z")

function minutesAgo(minutes: number): Date {
  return new Date(NOW.getTime() - minutes * 60_000)
}

type TestRow = DrainableRow & { id: string }

function row(overrides: Partial<TestRow> & { id: string }): TestRow {
  return {
    aiStatus: "pending",
    aiAttempts: 0,
    updatedAt: minutesAgo(5),
    ...overrides,
  }
}

const OPTS = {
  limit: 3,
  maxAttempts: 3,
  now: NOW,
  staleRunningMs: 10 * 60_000,
}

function ids(rows: TestRow[]): string[] {
  return rows.map((r) => r.id)
}

describe("selectDrainable", () => {
  it("returns pending rows oldest-first, bounded by limit", () => {
    const rows = [
      row({ id: "b", updatedAt: minutesAgo(20) }),
      row({ id: "d", updatedAt: minutesAgo(5) }),
      row({ id: "a", updatedAt: minutesAgo(30) }),
      row({ id: "c", updatedAt: minutesAgo(10) }),
    ]

    expect(ids(selectDrainable(rows, OPTS))).toEqual(["a", "b", "c"])
    expect(ids(selectDrainable(rows, { ...OPTS, limit: 2 }))).toEqual(["a", "b"])
  })

  it("includes failed rows under the attempt cap, skips rows at the cap", () => {
    const rows = [
      row({ id: "retryable", aiStatus: "failed", aiAttempts: 2, updatedAt: minutesAgo(30) }),
      row({ id: "terminal", aiStatus: "failed", aiAttempts: 3, updatedAt: minutesAgo(40) }),
      row({ id: "fresh", updatedAt: minutesAgo(1) }),
    ]

    expect(ids(selectDrainable(rows, OPTS))).toEqual(["retryable", "fresh"])
  })

  it("skips done and recent running rows, reclaims stale running rows", () => {
    const rows = [
      row({ id: "enriched", aiStatus: "done", updatedAt: minutesAgo(60) }),
      row({ id: "in-flight", aiStatus: "running", updatedAt: minutesAgo(2) }),
      row({ id: "interrupted", aiStatus: "running", updatedAt: minutesAgo(15) }),
      row({ id: "waiting", updatedAt: minutesAgo(1) }),
    ]

    expect(ids(selectDrainable(rows, OPTS))).toEqual(["interrupted", "waiting"])
  })
})
