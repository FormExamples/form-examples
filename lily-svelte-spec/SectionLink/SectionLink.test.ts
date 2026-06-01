import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SectionLink from "./SectionLink.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SectionLink", () => {
    it("renders with class", () => {
        const { container } = render(SectionLink, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".section-link");
        expect(el).toBeTruthy();
    });
});
