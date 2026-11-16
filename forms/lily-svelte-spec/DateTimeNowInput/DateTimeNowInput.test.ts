import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import DateTimeNowInput from "./DateTimeNowInput.svelte";

const labels = { dateLabel: "Fecha", timeLabel: "Hora", nowLabel: "Ahora" };

describe("DateTimeNowInput", () => {
    afterEach(() => vi.useRealTimers());

    test("renders a labelled group with the base class", () => {
        render(DateTimeNowInput, { props: { label: "Cita", ...labels } });
        const el = screen.getByRole("group", { name: "Cita" });
        expect(el.getAttribute("class")).toContain("date-time-now-input");
    });

    test("names the date input, time input and Now button from its props", () => {
        const { container } = render(DateTimeNowInput, { props: { label: "Cita", ...labels } });
        expect(container.querySelector('input[type="date"]')!.getAttribute("aria-label")).toBe(
            "Fecha",
        );
        expect(container.querySelector('input[type="time"]')!.getAttribute("aria-label")).toBe(
            "Hora",
        );
        const button = screen.getByRole("button", { name: "Ahora" });
        expect(button.textContent!.trim()).toBe("Ahora");
    });

    test("has no English default: without labels the controls carry no name or text", () => {
        const { container } = render(DateTimeNowInput, { props: { label: "Cita" } as never });
        for (const el of container.querySelectorAll("input, button"))
            expect(el.hasAttribute("aria-label")).toBe(false);
        expect(container.querySelector("button")!.textContent!.trim()).toBe("");
        expect(container.textContent).not.toMatch(/Date|Time|Now/);
    });

    test("Now fills both inputs with the current local date and time", async () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date(2026, 9, 31, 9, 5));
        const { container } = render(DateTimeNowInput, { props: { label: "Cita", ...labels } });
        await fireEvent.click(screen.getByRole("button", { name: "Ahora" }));
        expect((container.querySelector('input[type="date"]') as HTMLInputElement).value).toBe(
            "2026-10-31",
        );
        expect((container.querySelector('input[type="time"]') as HTMLInputElement).value).toBe(
            "09:05",
        );
    });
});
