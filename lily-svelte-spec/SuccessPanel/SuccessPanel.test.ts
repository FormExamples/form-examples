import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import SuccessPanel from "./SuccessPanel.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("SuccessPanel", () => {
    it("renders with class", () => {
        const { container } = render(SuccessPanel, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".success-panel");
        expect(el).toBeTruthy();
    });
});
