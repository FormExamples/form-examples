import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import TextAreaInputWithCharacterCounter from "./TextAreaInputWithCharacterCounter.svelte";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders with content", () => {
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test", maxLength: 100 } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        const wrapper = el.closest(".text-area-input-with-character-counter");
        expect(wrapper).toBeTruthy();
    });

    test("counts with the numbers alone by default: no English", () => {
        const { container } = render(TextAreaInputWithCharacterCounter, {
            props: { label: "Test", maxLength: 100 },
        });
        expect(container.textContent).toContain("0 / 100");
        expect(container.textContent).not.toMatch(/characters|of/);
    });

    test("fills in the consumer's counterTemplate", () => {
        const { container } = render(TextAreaInputWithCharacterCounter, {
            props: {
                label: "Test",
                maxLength: 100,
                counterTemplate: "{count} de {max} caractères",
            },
        });
        expect(container.textContent).toContain("0 de 100 caractères");
    });

    test("the counter is not live itself: a status takes it once typing pauses", async () => {
        vi.useFakeTimers();
        render(TextAreaInputWithCharacterCounter, { props: { label: "Test", maxLength: 10 } });
        const field = screen.getByLabelText("Test");
        const status = screen.getByRole("status");
        expect(document.querySelector("[aria-live]")).toBeNull();
        for (const text of ["a", "ab", "abc"]) {
            await fireEvent.input(field, { target: { value: text } });
            vi.advanceTimersByTime(300);
        }
        expect(status.textContent).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
        expect(status.textContent).toBe("3 / 10");
        expect(
            document.getElementById(field.getAttribute("aria-describedby")!)!.contains(status),
        ).toBe(true);
    });

    afterEach(() => vi.useRealTimers());
});
