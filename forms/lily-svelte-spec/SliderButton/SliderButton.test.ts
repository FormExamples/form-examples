import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";
import SliderButton from "./SliderButton.svelte";

const slider = () => screen.getByRole("slider", { name: "Confirm order" });

describe("SliderButton", () => {
    test("is a button with role slider, labelled, starting at 0 of 100", () => {
        render(SliderButton, { props: { label: "Confirm order" } });
        expect(slider().tagName).toBe("BUTTON");
        expect(slider().getAttribute("type")).toBe("button");
        expect(slider().getAttribute("class")).toContain("slider-button");
        expect(
            ["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) =>
                slider().getAttribute(a),
            ),
        ).toEqual(["0", "0", "100"]);
    });

    test("ArrowRight and ArrowLeft move by step; Home returns to 0", async () => {
        render(SliderButton, { props: { label: "Confirm order", step: 25 } });
        await fireEvent.keyDown(slider(), { key: "ArrowRight" });
        await fireEvent.keyDown(slider(), { key: "ArrowRight" });
        expect(slider().getAttribute("aria-valuenow")).toBe("50");
        await fireEvent.keyDown(slider(), { key: "ArrowLeft" });
        expect(slider().getAttribute("aria-valuenow")).toBe("25");
        await fireEvent.keyDown(slider(), { key: "Home" });
        expect(slider().getAttribute("aria-valuenow")).toBe("0");
        await fireEvent.keyDown(slider(), { key: "ArrowLeft" });
        expect(slider().getAttribute("aria-valuenow")).toBe("0");
    });

    test("reaching 100 confirms once and resets", async () => {
        const onconfirm = vi.fn();
        render(SliderButton, { props: { label: "Confirm order", step: 50, onconfirm } });
        await fireEvent.keyDown(slider(), { key: "ArrowRight" });
        expect(onconfirm).not.toHaveBeenCalled();
        await fireEvent.keyDown(slider(), { key: "ArrowRight" });
        expect(onconfirm).toHaveBeenCalledTimes(1);
        expect(slider().getAttribute("aria-valuenow")).toBe("0");
    });

    test("End, Enter and Space confirm immediately", async () => {
        const onconfirm = vi.fn();
        render(SliderButton, { props: { label: "Confirm order", onconfirm } });
        for (const key of ["End", "Enter", " "]) await fireEvent.keyDown(slider(), { key });
        expect(onconfirm).toHaveBeenCalledTimes(3);
    });

    test("cancels the keys it handles and leaves Tab alone", async () => {
        render(SliderButton, { props: { label: "Confirm order" } });
        const press = (key: string) => {
            const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
            slider().dispatchEvent(event);
            return event.defaultPrevented;
        };
        expect(["ArrowRight", "Enter", "Tab"].map(press)).toEqual([true, true, false]);
    });

    test("disabled ignores keys and confirms nothing", async () => {
        const onconfirm = vi.fn();
        render(SliderButton, { props: { label: "Confirm order", disabled: true, onconfirm } });
        expect((slider() as HTMLButtonElement).disabled).toBe(true);
        await fireEvent.keyDown(slider(), { key: "End" });
        await fireEvent.keyDown(slider(), { key: "ArrowRight" });
        expect(onconfirm).not.toHaveBeenCalled();
        expect(slider().getAttribute("aria-valuenow")).toBe("0");
    });
});
