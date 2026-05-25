import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import GoToTop from "./GoToTop.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("GoToTop", () => {
    it("renders with class", () => {
        const { container } = render(GoToTop, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".go-to-top");
        expect(el).toBeTruthy();
    });
});
