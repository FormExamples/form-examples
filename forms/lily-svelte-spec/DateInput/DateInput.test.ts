import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateInput.svelte";

describe("DateInput", () => {
    test("renders a date input", () => {
        render(Subject, { props: { label: "Date" } });
        const input = screen.getByLabelText("Date") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.type).toBe("date");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pick a date" } });
        expect(screen.getByLabelText("Pick a date")).toBeTruthy();
    });

    test("supports min attribute", () => {
        render(Subject, { props: { label: "Date", min: "2024-01-01" } });
        expect((screen.getByLabelText("Date") as HTMLInputElement).min).toBe("2024-01-01");
    });

    test("supports max attribute", () => {
        render(Subject, { props: { label: "Date", max: "2024-12-31" } });
        expect((screen.getByLabelText("Date") as HTMLInputElement).max).toBe("2024-12-31");
    });

    test("supports required attribute", () => {
        render(Subject, { props: { label: "Date", required: true } });
        expect((screen.getByLabelText("Date") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled attribute", () => {
        render(Subject, { props: { label: "Date", disabled: true } });
        expect((screen.getByLabelText("Date") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Date", "data-testid": "di" } });
        expect(screen.getByTestId("di")).toBeTruthy();
    });
});
