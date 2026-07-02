import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import AddressInput from "./AddressInput.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("AddressInput", () => {
    it("renders with class", () => {
        const { container } = render(AddressInput, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".address-input");
        expect(el).toBeTruthy();
    });
});
