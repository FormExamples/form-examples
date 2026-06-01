import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import DocumentListItem from "./DocumentListItem.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("DocumentListItem", () => {
    it("renders with class", () => {
        const { container } = render(DocumentListItem, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".document-list-item");
        expect(el).toBeTruthy();
    });
});
