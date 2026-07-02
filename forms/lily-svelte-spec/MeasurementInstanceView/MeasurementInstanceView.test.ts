import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementInstanceView.svelte";

describe("MeasurementInstanceView", () => {
    test("renders the measurement value", () => {
        render(Subject, { props: { value: "72 kg" } });
        expect(screen.getByText("72 kg")).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(Subject, { props: { value: "98.6 F", "data-testid": "mv" } });
        expect(screen.getByTestId("mv").tagName).toBe("SPAN");
    });

    test("supports aria-label", () => {
        render(Subject, { props: { value: "120/80", label: "Blood pressure" } });
        expect(screen.getByText("120/80").getAttribute("aria-label")).toBe("Blood pressure");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "42", "data-testid": "miv" } });
        expect(screen.getByTestId("miv")).toBeTruthy();
    });
});
