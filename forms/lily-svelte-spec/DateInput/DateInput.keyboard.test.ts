import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./DateInput.svelte";

describe("DateInput keyboard", () => {
    test("Tab reaches it, by name", async () => {
        render(Subject, { props: { label: "Name" } });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.date-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, { props: { label: "Name", disabled: true } });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
