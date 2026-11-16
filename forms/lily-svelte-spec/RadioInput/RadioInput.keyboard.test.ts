import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./RadioInput.svelte";

describe("RadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        render(Subject, { props: { label: "Yes", name: "choice" } });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, { props: { label: "Yes", name: "choice", disabled: true } });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
