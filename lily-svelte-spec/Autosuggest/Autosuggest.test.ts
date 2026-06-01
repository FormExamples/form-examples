import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Autosuggest from "./Autosuggest.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("Autosuggest", () => {
    it("renders with class", () => {
        const { container } = render(Autosuggest, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".autosuggest");
        expect(el).toBeTruthy();
    });
});
