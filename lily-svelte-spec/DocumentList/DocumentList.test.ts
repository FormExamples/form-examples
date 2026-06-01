import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import DocumentList from "./DocumentList.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("DocumentList", () => {
    it("renders with class", () => {
        const { container } = render(DocumentList, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".document-list");
        expect(el).toBeTruthy();
    });
});
