import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateRange.svelte";

describe("DateRange", () => {
    test("renders two date inputs", () => {
        render(Subject, { props: { label: "Dates", startLabel: "Start", endLabel: "End" } });
        expect(screen.getByLabelText("Start")).toBeTruthy();
        expect(screen.getByLabelText("End")).toBeTruthy();
    });

    test("has group aria-label", () => {
        render(Subject, { props: { label: "Trip dates", startLabel: "From", endLabel: "To" } });
        expect(screen.getByLabelText("Trip dates").tagName).toBe("FIELDSET");
    });

    test("both are date type inputs", () => {
        render(Subject, { props: { label: "Dates", startLabel: "Start", endLabel: "End" } });
        expect((screen.getByLabelText("Start") as HTMLInputElement).type).toBe("date");
        expect((screen.getByLabelText("End") as HTMLInputElement).type).toBe("date");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "D", startLabel: "S", endLabel: "E", "data-testid": "dr" } });
        expect(screen.getByTestId("dr")).toBeTruthy();
    });
});
