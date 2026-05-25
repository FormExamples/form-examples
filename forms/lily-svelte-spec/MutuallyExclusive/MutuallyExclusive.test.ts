import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import MutuallyExclusive from "./MutuallyExclusive.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("MutuallyExclusive", () => {
    it("renders with class", () => {
        const { container } = render(MutuallyExclusive, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".mutually-exclusive");
        expect(el).toBeTruthy();
    });
});
