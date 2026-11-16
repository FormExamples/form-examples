import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./EmailInput.svelte";

describe("EmailInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        render(Subject, { props: { label: "Name" } });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.email-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("a@b.org");
        expect(el.value).toBe("a@b.org");
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, { props: { label: "Name", disabled: true } });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
