import { describe, it, expect } from "vitest";
import { navItems, contactItem } from "./nav-items";

describe("nav-items", () => {
  it("has the correct items in the correct order", () => {
    const names = navItems.map((item) => item.name);
    expect(names).toEqual(["About", "Learn", "Bookmarks", "Newsletter"]);
  });

  it("does not include a Home entry", () => {
    const names = navItems.map((item) => item.name);
    expect(names).not.toContain("Home");
  });

  it("links Bookmarks to /bookmarks", () => {
    const bookmarks = navItems.find((item) => item.name === "Bookmarks");
    expect(bookmarks).toBeDefined();
    expect(bookmarks!.href).toBe("/bookmarks");
  });

  it("keeps Contact as a separate item routing to /contact", () => {
    expect(contactItem).toEqual({ name: "Contact", href: "/contact" });
  });

  it("produces the full navbar order: About, Learn, Bookmarks, Newsletter, Contact", () => {
    const allNames = [...navItems, contactItem].map((item) => item.name);
    expect(allNames).toEqual([
      "About",
      "Learn",
      "Bookmarks",
      "Newsletter",
      "Contact",
    ]);
  });
});
