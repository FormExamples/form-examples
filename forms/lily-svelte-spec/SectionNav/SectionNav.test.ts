import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SectionNav from "./SectionNav.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SectionNav", () => {
    it("renders with class", () => {
        const { container } = render(SectionNav, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".section-nav");
        expect(el).toBeTruthy();
    });
});
