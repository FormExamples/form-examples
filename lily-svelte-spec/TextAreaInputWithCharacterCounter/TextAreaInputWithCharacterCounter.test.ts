import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders with content", () => {
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test", maxLength: 100 } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        const wrapper = el.closest(".text-area-input-with-character-counter");
        expect(wrapper).toBeTruthy();
    });
});
