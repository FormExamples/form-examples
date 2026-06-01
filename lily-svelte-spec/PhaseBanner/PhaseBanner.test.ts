import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import PhaseBanner from "./PhaseBanner.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("PhaseBanner", () => {
    it("renders with class", () => {
        const { container } = render(PhaseBanner, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".phase-banner");
        expect(el).toBeTruthy();
    });
});
