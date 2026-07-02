import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SharePage from "./SharePage.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SharePage", () => {
    it("renders with class", () => {
        const { container } = render(SharePage, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".share-page");
        expect(el).toBeTruthy();
    });
});
