import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NumericRatingScalePicker.svelte";

const props = {
    label: "How bad is your pain now?",
    minLabel: "No pain",
    maxLabel: "Worst pain imaginable",
};

describe("NumericRatingScalePicker", () => {
    test("is a fieldset named by its legend, with a radio for each number from 0 to 10", () => {
        render(Subject, { props });
        const group = screen.getByRole("group", { name: "How bad is your pain now?" });
        expect(group.tagName).toBe("FIELDSET");
        const radios = screen.getAllByRole("radio");
        expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual([
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
        ]);
    });

    test("the end radios are described by the consumer's anchor words", () => {
        render(Subject, { props });
        expect(
            screen.getByRole("radio", { name: "0" }).getAttribute("aria-describedby"),
        ).toBeTruthy();
        expect(screen.getByRole("radio", { name: "0", description: "No pain" })).toBeTruthy();
        expect(
            screen.getByRole("radio", { name: "10", description: "Worst pain imaginable" }),
        ).toBeTruthy();
        expect(screen.getByRole("radio", { name: "5" }).hasAttribute("aria-describedby")).toBe(
            false,
        );
    });

    test("min and max change the range", () => {
        render(Subject, { props: { label: "Rate it", min: 1, max: 5 } });
        expect(screen.getAllByRole("radio").map((r) => (r as HTMLInputElement).value)).toEqual([
            "1",
            "2",
            "3",
            "4",
            "5",
        ]);
    });

    test("arrow keys move and choose, as native radios do", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { ...props, value: "3" } });
        screen.getByRole("radio", { name: "3" }).focus();
        await user.keyboard("{ArrowRight}");
        expect((screen.getByRole("radio", { name: "4" }) as HTMLInputElement).checked).toBe(true);
    });

    test("required marks the group as needing an answer", () => {
        render(Subject, { props: { ...props, required: true } });
        expect((screen.getByRole("radio", { name: "0" }) as HTMLInputElement).required).toBe(true);
    });

    test("writes no anchor words of its own", () => {
        render(Subject, { props: { label: "Rate it" } });
        expect(document.querySelector(".numeric-rating-scale-picker-min-label")).toBeNull();
        expect(document.querySelector(".numeric-rating-scale-picker-max-label")).toBeNull();
    });

    test("a form reset restores the first value", async () => {
        const form = document.createElement("form");
        document.body.append(form);
        const { container } = render(Subject, {
            target: form,
            props: { label: "Pain", min: 0, max: 10, value: "5" },
        });
        const radio = (n: number) =>
            container.querySelector<HTMLInputElement>(`input[value="${n}"]`)!;
        radio(7).click();
        await tick();
        expect(radio(7).checked).toBe(true);
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(radio(5).checked).toBe(true);
        expect(radio(7).checked).toBe(false);
        form.remove();
    });

    test("a reset another handler cancels changes nothing", async () => {
        const form = document.createElement("form");
        document.body.append(form);
        const { container } = render(Subject, {
            target: form,
            props: { label: "Pain", min: 0, max: 3, value: "1" },
        });
        container.querySelector<HTMLInputElement>('input[value="2"]')!.click();
        await tick();
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(container.querySelector<HTMLInputElement>('input[value="2"]')!.checked).toBe(true);
        form.remove();
    });
});
