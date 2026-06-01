import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementUnitInput.svelte";

describe("MeasurementUnitInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Unit" } });
        expect((screen.getByLabelText("Unit") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(Subject, { props: { label: "Unit of measure" } });
        expect(screen.getByLabelText("Unit of measure")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Unit", required: true } });
        expect((screen.getByLabelText("Unit") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Unit", disabled: true } });
        expect((screen.getByLabelText("Unit") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "U", "data-testid": "mui" } });
        expect(screen.getByTestId("mui")).toBeTruthy();
    });
});
