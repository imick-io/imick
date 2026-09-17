import { describe, it, expect } from "vitest";
import { siteConfig } from "./config";

describe("siteConfig", () => {
  it("carries the person-led tagline", () => {
    expect(siteConfig.tagline).toBe(
      "I optimize everything, and I write all of it down.",
    );
  });

  it("describes the person, not the funnel", () => {
    expect(siteConfig.description).toBe(
      "Michael Boutin on building products with AI, the career around it, and the systems that make the rest of it work. Written down as it happens.",
    );
  });

  it("leaves the role untouched", () => {
    expect(siteConfig.role).toBe("Senior Product Engineer");
  });

  it("uses no em-dashes in tagline or description", () => {
    expect(siteConfig.tagline).not.toContain("—");
    expect(siteConfig.description).not.toContain("—");
  });
});
