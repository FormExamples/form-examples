import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import RelatedContent from "./RelatedContent.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("RelatedContent", () => {
    it("renders with class", () => {
        const { container } = render(RelatedContent, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".related-content");
        expect(el).toBeTruthy();
    });
});
