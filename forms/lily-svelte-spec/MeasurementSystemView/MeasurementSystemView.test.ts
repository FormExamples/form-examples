import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementSystemView.svelte";

describe("MeasurementSystemView", () => {
    test("renders the measurement system name", () => {
        render(Subject, { props: { value: "metric" } });
        expect(screen.getByText("metric")).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(Subject, { props: { value: "imperial", "data-testid": "ms" } });
        expect(screen.getByTestId("ms").tagName).toBe("SPAN");
    });

    test("supports aria-label", () => {
        render(Subject, { props: { value: "SI", label: "International System" } });
        expect(screen.getByText("SI").getAttribute("aria-label")).toBe("International System");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "metric", "data-testid": "msv" } });
        expect(screen.getByTestId("msv")).toBeTruthy();
    });
});
