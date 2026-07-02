import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NumberInput.svelte";

describe("NumberInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Qty" } });
        expect((screen.getByLabelText("Qty") as HTMLInputElement).type).toBe("number");
    });

    test("supports min/max", () => {
        render(Subject, { props: { label: "Qty", min: 0, max: 99 } });
        const input = screen.getByLabelText("Qty") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("99");
    });

    test("supports step", () => {
        render(Subject, { props: { label: "Qty", step: 5 } });
        expect((screen.getByLabelText("Qty") as HTMLInputElement).step).toBe("5");
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Qty", required: true } });
        expect((screen.getByLabelText("Qty") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "ni" } });
        expect(screen.getByTestId("ni")).toBeTruthy();
    });
});
