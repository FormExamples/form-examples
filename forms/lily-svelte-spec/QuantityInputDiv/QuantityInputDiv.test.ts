import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./QuantityInputDiv.svelte";

const units = [
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
];
const base = { label: "Weight", magnitudeLabel: "Amount", unitLabel: "Unit", units };

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("QuantityInputDiv", () => {
    test("renders a named group with a labelled number and a labelled unit select", () => {
        const { container } = render(Subject, { props: { ...base, class: "extra" } });
        const group = screen.getByRole("group", { name: "Weight" });
        expect(group).toBe(container.querySelector("div.quantity-input-div"));
        expect(group.className).toContain("extra");
        const number = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(number.type).toBe("number");
        expect((screen.getByLabelText("Unit") as HTMLSelectElement).value).toBe("kg");
    });

    test("the number takes the limits of the unit chosen", async () => {
        render(Subject, { props: base });
        const number = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(number.max).toBe("300");
        await fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "[lb_av]" } });
        expect(number.max).toBe("660");
        expect(number.step).toBe("0.1");
    });

    test("changing the unit keeps the number as typed: nothing is converted", async () => {
        render(Subject, { props: base });
        const number = screen.getByLabelText("Amount") as HTMLInputElement;
        await fireEvent.input(number, { target: { value: "70" } });
        await fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "[lb_av]" } });
        expect(number.value).toBe("70");
    });

    test("one unit is text, linked to the number, and submitted with it", () => {
        const { container } = render(Subject, {
            props: { label: "Weight", magnitudeLabel: "Amount", units: [units[0]], name: "weight" },
        });
        expect(container.querySelector("select")).toBeNull();
        const number = screen.getByLabelText("Amount");
        const unit = container.querySelector(".quantity-input-div-unit") as HTMLElement;
        expect(unit.tagName).toBe("SPAN");
        expect(number.getAttribute("aria-describedby")).toBe(unit.id);
        expect((container.querySelector('input[type="hidden"]') as HTMLInputElement).name).toBe(
            "weight-unit",
        );
    });

    test("names the fields from name", () => {
        const { container } = render(Subject, { props: { ...base, name: "weight" } });
        expect(
            (container.querySelector(".quantity-input-div-magnitude") as HTMLInputElement).name,
        ).toBe("weight-magnitude");
        expect((container.querySelector("select") as HTMLSelectElement).name).toBe("weight-unit");
    });

    test("a form reset puts both values back", async () => {
        const form = document.createElement("form");
        document.body.append(form);
        render(Subject, { target: form, props: { ...base, magnitude: "70" } });
        const number = screen.getByLabelText("Amount") as HTMLInputElement;
        await fireEvent.input(number, { target: { value: "82" } });
        await fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "[lb_av]" } });
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(number.value).toBe("70");
        expect((screen.getByLabelText("Unit") as HTMLSelectElement).value).toBe("kg");
        form.remove();
    });

    test("warns when more than one unit has no unit label", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { ...base, unitLabel: undefined } });
        expect(warn).toHaveBeenCalledWith(
            expect.stringContaining("QuantityInputDiv has no unitLabel"),
        );
    });
});
