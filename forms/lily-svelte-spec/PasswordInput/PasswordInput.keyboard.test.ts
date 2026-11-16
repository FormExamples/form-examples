import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./PasswordInput.svelte";

describe("PasswordInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        render(Subject, { props: { label: "Name" } });
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.password-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("secret");
        expect(el.value).toBe("secret");
    });

    test("Tab skips it when disabled", async () => {
        render(Subject, { props: { label: "Name", disabled: true } });
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
