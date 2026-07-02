import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementUnitView.svelte";

describe("MeasurementUnitView", () => {
    test("renders the measurement unit", () => {
        render(Subject, { props: { value: "kg" } });
        expect(screen.getByText("kg")).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(Subject, { props: { value: "lb", "data-testid": "mu" } });
        expect(screen.getByTestId("mu").tagName).toBe("SPAN");
    });

    test("supports aria-label", () => {
        render(Subject, { props: { value: "cm", label: "Centimeters" } });
        expect(screen.getByText("cm").getAttribute("aria-label")).toBe("Centimeters");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "inch", "data-testid": "muv" } });
        expect(screen.getByTestId("muv")).toBeTruthy();
    });
});
