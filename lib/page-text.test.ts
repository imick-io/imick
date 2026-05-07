import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { extractPageText } from "./page-text";

function loadFixture(name: string): string {
  return readFileSync(join(__dirname, "__fixtures__", name), "utf-8");
}

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(html: string, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(html),
  } as Response;
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("extractPageText", () => {
  it("returns cleaned text when stripped result is at least 500 chars", async () => {
    const html = loadFixture("substantial.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com");

    expect(result).not.toBeNull();
    expect(typeof result).toBe("string");
    expect(result!.length).toBeGreaterThanOrEqual(500);
  });

  it("removes script and style blocks from the output", async () => {
    const html = loadFixture("substantial.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com");

    expect(result).not.toContain("console.log");
    expect(result).not.toContain("analytics loaded");
    expect(result).not.toContain("gtag");
    expect(result).not.toContain("font-family");
    expect(result).not.toContain("max-width");
  });

  it("strips HTML tags from the output", async () => {
    const html = loadFixture("substantial.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com");

    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("collapses whitespace in the output", async () => {
    const html = loadFixture("substantial.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com");

    expect(result).not.toMatch(/\s{2,}/);
  });

  it("returns null when stripped result is below 500 chars", async () => {
    const html = loadFixture("mostly-scripts.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com/spa");

    expect(result).toBeNull();
  });

  it("returns null on non-200 response", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse("Not Found", 404));

    const result = await extractPageText("https://example.com/missing");

    expect(result).toBeNull();
  });

  it("returns null on fetch error (network failure)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await extractPageText("https://example.com/down");

    expect(result).toBeNull();
  });

  it("truncates returned text to no more than 10,000 chars", async () => {
    const html = loadFixture("long-page.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com/long");

    expect(result).not.toBeNull();
    expect(result!.length).toBeLessThanOrEqual(10_000);
  });

  it("preserves meaningful content from the page", async () => {
    const html = loadFixture("substantial.html");
    mockFetch.mockResolvedValueOnce(mockResponse(html));

    const result = await extractPageText("https://example.com");

    expect(result).toContain("Modern Web Development");
    expect(result).toContain("TypeScript");
    expect(result).toContain("Component-based");
  });
});
