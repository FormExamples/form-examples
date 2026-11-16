import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, test } from "vitest";
import DigitalObjectIdentifierLink from "./DigitalObjectIdentifierLink.svelte";

describe("DigitalObjectIdentifierLink", () => {
    test("links to the DOI through the doi.org resolver, showing the DOI by default", () => {
        render(DigitalObjectIdentifierLink, { props: { doi: "10.1000/xyz123" } });
        const link = screen.getByRole("link", { name: "10.1000/xyz123" });
        expect(link.tagName).toBe("A");
        expect(link.getAttribute("href")).toBe("https://doi.org/10.1000/xyz123");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
        expect(link.getAttribute("class")).toContain("digital-object-identifier-link");
    });

    test("children replace the displayed DOI", () => {
        const children = createRawSnippet(() => ({ render: () => "<span>The article</span>" }));
        render(DigitalObjectIdentifierLink, { props: { doi: "10.1000/xyz123", children } });
        expect(screen.getByRole("link", { name: "The article" }).getAttribute("href")).toBe(
            "https://doi.org/10.1000/xyz123",
        );
    });
});
