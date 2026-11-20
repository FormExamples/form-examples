import { fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { describe, expect, test, vi } from "vitest";
import RangeFieldset from "./RangeFieldset.svelte";

const base = { legend: "Price", minimumLabel: "Lowest price", maximumLabel: "Highest price" };

function thumbs() {
    return {
        lower: screen.getByLabelText("Lowest price") as HTMLInputElement,
        upper: screen.getByLabelText("Highest price") as HTMLInputElement,
    };
}

describe("RangeFieldset", () => {
    test("is a fieldset named by its legend, with two range inputs on one scale", () => {
        render(RangeFieldset, { props: { ...base, min: 10, max: 90, step: 5 } });
        const group = screen.getByRole("group", { name: "Price" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.getAttribute("class")).toContain("range-fieldset");
        expect(group.querySelector("legend.range-fieldset-legend")?.textContent).toBe("Price");
        const { lower, upper } = thumbs();
        expect(lower.type).toBe("range");
        expect(lower.className).toBe("range-fieldset-minimum");
        expect(upper.className).toBe("range-fieldset-maximum");
        for (const input of [lower, upper]) {
            expect(input.min).toBe("10");
            expect(input.max).toBe("90");
            expect(input.step).toBe("5");
        }
        expect(lower.value).toBe("10");
        expect(upper.value).toBe("90");
    });

    test("the lower thumb stops at the upper one", async () => {
        const onchange = vi.fn();
        render(RangeFieldset, { props: { ...base, minimum: 20, maximum: 60, onchange } });
        const { lower } = thumbs();
        await fireEvent.input(lower, { target: { value: "80" } });
        expect(lower.value).toBe("60");
        expect(onchange).toHaveBeenLastCalledWith(60, 60);
    });

    test("the upper thumb stops at the lower one", async () => {
        render(RangeFieldset, { props: { ...base, minimum: 20, maximum: 60 } });
        const { upper } = thumbs();
        await fireEvent.input(upper, { target: { value: "5" } });
        expect(upper.value).toBe("20");
    });

    test("a move within bounds is kept and reported", async () => {
        const onchange = vi.fn();
        render(RangeFieldset, { props: { ...base, minimum: 20, maximum: 60, onchange } });
        const { lower, upper } = thumbs();
        await fireEvent.input(lower, { target: { value: "30" } });
        await fireEvent.input(upper, { target: { value: "70" } });
        expect(lower.value).toBe("30");
        expect(upper.value).toBe("70");
        expect(onchange).toHaveBeenLastCalledWith(30, 70);
    });

    test("both values submit as their own form fields", () => {
        const { container } = render(RangeFieldset, {
            props: {
                ...base,
                minimum: 25,
                maximum: 75,
                minimumName: "price-min",
                maximumName: "price-max",
            },
        });
        const form = document.createElement("form");
        form.append(container.querySelector("fieldset")!);
        const data = new FormData(form);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
    });

    test("a form reset puts both thumbs back", async () => {
        const { container } = render(RangeFieldset, {
            props: { ...base, minimum: 25, maximum: 75 },
        });
        const form = document.createElement("form");
        container.append(form);
        form.append(container.querySelector("fieldset")!);
        const { lower, upper } = thumbs();
        await fireEvent.input(lower, { target: { value: "40" } });
        await fireEvent.input(upper, { target: { value: "50" } });
        form.reset();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
        // And they stay back once the component has caught up, which is what the next move reads.
        await new Promise((resolve) => setTimeout(resolve, 0));
        await tick();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
    });

    test("disabled disables both thumbs", () => {
        render(RangeFieldset, { props: { ...base, disabled: true } });
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(RangeFieldset, { props: { ...base, "data-testid": "rf" } });
        expect(screen.getByTestId("rf")).toBeTruthy();
    });

    test("a form reset restores both thumbs, so the next move clamps against them", async () => {
        const form = document.createElement("form");
        document.body.append(form);
        const onchange = vi.fn();
        const { container } = render(RangeFieldset, {
            target: form,
            props: {
                legend: "Price",
                minimumLabel: "Minimum",
                maximumLabel: "Maximum",
                minimum: 20,
                maximum: 80,
                onchange,
            },
        });
        const lower = container.querySelector<HTMLInputElement>(".range-fieldset-minimum")!;
        const upper = container.querySelector<HTMLInputElement>(".range-fieldset-maximum")!;
        await tick(); // the reset listener is attached by an effect, after mount
        lower.value = "50";
        lower.dispatchEvent(new Event("input", { bubbles: true }));
        expect(onchange).toHaveBeenLastCalledWith(50, 80);
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        // The minimum is 20 again, so the upper thumb can come down to 30.
        upper.value = "30";
        upper.dispatchEvent(new Event("input", { bubbles: true }));
        expect(upper.value).toBe("30");
        expect(onchange).toHaveBeenLastCalledWith(20, 30);
        form.remove();
    });
});
