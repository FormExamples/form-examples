import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ToggleButton.svelte";

describe("ToggleButton", () => {
    test("renders a native button with no switch role: the toggle button pattern", () => {
        render(Subject, { props: { label: "Dark mode" } });
        expect(screen.getByRole("button").getAttribute("role")).toBeNull();
        expect(screen.queryByRole("switch")).toBeNull();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Dark mode" } });
        expect(screen.getByLabelText("Dark mode")).toBeTruthy();
    });

    test("has aria-pressed false by default", () => {
        render(Subject, { props: { label: "ToggleButton" } });
        expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
    });

    test("toggles on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "ToggleButton" } });
        const btn = screen.getByRole("button");
        await user.click(btn);
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("toggles on space key", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "ToggleButton" } });
        const btn = screen.getByRole("button");
        btn.focus();
        await user.keyboard(" ");
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "ToggleButton", disabled: true } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tg" } });
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
