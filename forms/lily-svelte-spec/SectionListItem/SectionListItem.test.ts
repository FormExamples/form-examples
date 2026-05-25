import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SectionListItem from "./SectionListItem.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SectionListItem", () => {
    it("renders with class", () => {
        const { container } = render(SectionListItem, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".section-list-item");
        expect(el).toBeTruthy();
    });
});
