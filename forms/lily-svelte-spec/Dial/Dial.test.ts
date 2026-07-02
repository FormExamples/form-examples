import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Dial.svelte";

describe("Dial", () => {
    test("renders as a slider", () => {
        render(Subject, { props: { label: "Volume" } });
        expect(screen.getByRole("slider", { name: "Volume" })).toBeTruthy();
    });

    test("has correct ARIA value attributes", () => {
        render(Subject, { props: { label: "Volume", value: 50, min: 0, max: 100 } });
        const slider = screen.getByRole("slider");
        expect(slider.getAttribute("aria-valuenow")).toBe("50");
        expect(slider.getAttribute("aria-valuemin")).toBe("0");
        expect(slider.getAttribute("aria-valuemax")).toBe("100");
    });

    test("ArrowRight increases value", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("51");
    });

    test("ArrowLeft decreases value", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowLeft}");
        expect(slider.getAttribute("aria-valuenow")).toBe("49");
    });

    test("Shift+Arrow uses large step", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50, step: 1 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
        expect(slider.getAttribute("aria-valuenow")).toBe("60");
    });

    test("Home sets to min", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50, min: 0 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{Home}");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("End sets to max", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50, max: 100 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{End}");
        expect(slider.getAttribute("aria-valuenow")).toBe("100");
    });

    test("clamps value at min", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 0, min: 0 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowLeft}");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("clamps value at max", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 100, max: 100 } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("100");
    });

    test("disabled dial ignores keys", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Vol", value: 50, disabled: true } });
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("50");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Vol", "data-testid": "dial" } });
        expect(screen.getByTestId("dial")).toBeTruthy();
    });
});
