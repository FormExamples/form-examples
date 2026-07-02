import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import DescriptionListItem from "./DescriptionListItem.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("DescriptionListItem", () => {
    it("renders with class", () => {
        const { container } = render(DescriptionListItem, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".description-list-item");
        expect(el).toBeTruthy();
    });
});
