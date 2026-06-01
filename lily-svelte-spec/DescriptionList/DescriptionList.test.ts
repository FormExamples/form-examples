import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import DescriptionList from "./DescriptionList.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("DescriptionList", () => {
    it("renders with class", () => {
        const { container } = render(DescriptionList, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".description-list");
        expect(el).toBeTruthy();
    });
});
