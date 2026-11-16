import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, test } from "vitest";
import TreeLink from "./TreeLink.svelte";

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe("TreeLink", () => {
    test("renders a link with its base class, href and content", () => {
        render(TreeLink, { props: { href: "/next", children: text("Next") } });
        const link = screen.getByRole("link", { name: "Next" });
        expect(link.tagName).toBe("A");
        expect(link.getAttribute("href")).toBe("/next");
        expect(link.getAttribute("class")).toContain("tree-link");
    });

    test("label overrides the accessible name", () => {
        render(TreeLink, { props: { href: "/next", label: "Next page", children: text("Next") } });
        expect(screen.getByRole("link", { name: "Next page" })).toBeTruthy();
    });

    test("passes through other attributes", () => {
        render(TreeLink, {
            props: { href: "/next", "aria-current": "page", children: text("Next") },
        });
        expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");
    });
});
