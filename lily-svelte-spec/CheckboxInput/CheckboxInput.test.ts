import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./CheckboxInput.svelte";

describe("CheckboxInput", () => {
    test("renders as a checkbox", () => {
        render(Subject, { props: { label: "Accept" } });
        expect(screen.getByRole("checkbox", { name: "Accept" })).toBeTruthy();
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Toggle" } });
        const cb = screen.getByRole("checkbox") as HTMLInputElement;
        await user.click(cb);
        expect(cb.checked).toBe(true);
    });

    test("can be disabled", () => {
        render(Subject, { props: { label: "Disabled", disabled: true } });
        expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(true);
    });

    test("applies name and value", () => {
        render(Subject, { props: { label: "Opt", name: "opt", value: "1" } });
        const cb = screen.getByRole("checkbox");
        expect(cb.getAttribute("name")).toBe("opt");
        expect(cb.getAttribute("value")).toBe("1");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Focus" } });
        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("checkbox"));
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Test", "data-testid": "cb" } });
        expect(screen.getByTestId("cb")).toBeTruthy();
    });
});
