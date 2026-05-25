import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementSystemInput.svelte";

describe("MeasurementSystemInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "System" } });
        expect((screen.getByLabelText("System") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(Subject, { props: { label: "Measurement system" } });
        expect(screen.getByLabelText("Measurement system")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "System", required: true } });
        expect((screen.getByLabelText("System") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "System", disabled: true } });
        expect((screen.getByLabelText("System") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "msi" } });
        expect(screen.getByTestId("msi")).toBeTruthy();
    });
});
