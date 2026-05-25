import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateTimeLocalInput.svelte";

describe("DateTimeLocalInput", () => {
    test("renders a datetime-local input", () => {
        render(Subject, { props: { label: "Event" } });
        const input = screen.getByLabelText("Event") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.type).toBe("datetime-local");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pick time" } });
        expect(screen.getByLabelText("Pick time")).toBeTruthy();
    });

    test("supports min attribute", () => {
        render(Subject, { props: { label: "Event", min: "2024-01-01T00:00" } });
        expect((screen.getByLabelText("Event") as HTMLInputElement).min).toBe("2024-01-01T00:00");
    });

    test("supports max attribute", () => {
        render(Subject, { props: { label: "Event", max: "2024-12-31T23:59" } });
        expect((screen.getByLabelText("Event") as HTMLInputElement).max).toBe("2024-12-31T23:59");
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Event", required: true } });
        expect((screen.getByLabelText("Event") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Event", disabled: true } });
        expect((screen.getByLabelText("Event") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Event", "data-testid": "dtl" } });
        expect(screen.getByTestId("dtl")).toBeTruthy();
    });
});
