import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementInstanceInput.svelte";

describe("MeasurementInstanceInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Weight" } });
        expect((screen.getByLabelText("Weight") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(Subject, { props: { label: "Temperature" } });
        expect(screen.getByLabelText("Temperature")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Weight", required: true } });
        expect((screen.getByLabelText("Weight") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Weight", disabled: true } });
        expect((screen.getByLabelText("Weight") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "W", "data-testid": "mii" } });
        expect(screen.getByTestId("mii")).toBeTruthy();
    });
});
