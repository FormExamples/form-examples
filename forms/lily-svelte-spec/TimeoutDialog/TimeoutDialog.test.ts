import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import TimeoutDialog from "./TimeoutDialog.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("TimeoutDialog", () => {
    it("renders with class", () => {
        const { container } = render(TimeoutDialog, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".timeout-dialog");
        expect(el).toBeTruthy();
    });
});
