import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import StatusTag from "./StatusTag.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("StatusTag", () => {
    it("renders with class", () => {
        const { container } = render(StatusTag, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".status-tag");
        expect(el).toBeTruthy();
    });
});
