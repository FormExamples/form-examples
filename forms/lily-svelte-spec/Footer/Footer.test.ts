import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Footer.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Footer", () => {
    test("renders as contentinfo landmark", () => {
        render(Subject, { props: { children: textSnippet("Copyright") } });
        expect(screen.getByRole("contentinfo")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(Subject, { props: { label: "Site footer", children: textSnippet("C") } });
        expect(screen.getByRole("contentinfo").getAttribute("aria-label")).toBe("Site footer");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("2024 All rights") } });
        expect(screen.getByRole("contentinfo").textContent).toContain("2024 All rights");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "ft", children: textSnippet("C") } });
        expect(screen.getByTestId("ft")).toBeTruthy();
    });
});
