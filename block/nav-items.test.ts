import { describe, it, expect } from "vitest";
import { navItems, contactItem } from "./nav-items";

describe("nav-items", () => {
  it("links Bookmarks to /bookmarks", () => {
    expect(navItems).toContainEqual({ name: "Bookmarks", href: "/bookmarks" });
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
