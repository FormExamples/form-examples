import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./CheckboxInput.svelte";

describe("CheckboxInput keyboard", () => {
    test("Tab reaches it, and Space toggles it", async () => {
        render(Subject, { props: { label: "Agree" } });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.checkbox-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Agree");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
        await user.keyboard(" ");
        expect(el.checked).toBe(false);
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, { props: { label: "Agree", disabled: true } });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
