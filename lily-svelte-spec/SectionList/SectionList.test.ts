import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SectionList from "./SectionList.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SectionList", () => {
    it("renders with class", () => {
        const { container } = render(SectionList, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".section-list");
        expect(el).toBeTruthy();
    });
});
