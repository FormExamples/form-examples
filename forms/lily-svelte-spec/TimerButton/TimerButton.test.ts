import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import TimerButton from "./TimerButton.svelte";

const button = () => screen.getByRole("button", { name: "Continue" });

describe("TimerButton", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    test("is a labelled button announcing politely, with the countdown in data-remaining-seconds", () => {
        render(TimerButton, { props: { label: "Continue", duration: 5 } });
        expect(button().tagName).toBe("BUTTON");
        expect(button().getAttribute("type")).toBe("button");
        expect(button().getAttribute("class")).toContain("timer-button");
        expect(button().getAttribute("aria-live")).toBe("polite");
        expect(button().getAttribute("data-remaining-seconds")).toBe("5");
    });

    test("counts down and activates itself once at zero", async () => {
        const onclick = vi.fn();
        render(TimerButton, { props: { label: "Continue", duration: 3, onclick } });
        await vi.advanceTimersByTimeAsync(1250);
        expect(button().getAttribute("data-remaining-seconds")).toBe("2");
        await vi.advanceTimersByTimeAsync(2000);
        expect(onclick).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(5000);
        expect(onclick).toHaveBeenCalledTimes(1);
    });

    test("a click activates at once, and only once", async () => {
        const onclick = vi.fn();
        render(TimerButton, { props: { label: "Continue", duration: 30, onclick } });
        await fireEvent.click(button());
        expect(onclick).toHaveBeenCalledTimes(1);
        await fireEvent.click(button());
        await vi.advanceTimersByTimeAsync(31000);
        expect(onclick).toHaveBeenCalledTimes(1);
    });

    test("disabled neither counts down nor activates", async () => {
        const onclick = vi.fn();
        render(TimerButton, { props: { label: "Continue", duration: 1, disabled: true, onclick } });
        await vi.advanceTimersByTimeAsync(3000);
        expect(onclick).not.toHaveBeenCalled();
    });
});
