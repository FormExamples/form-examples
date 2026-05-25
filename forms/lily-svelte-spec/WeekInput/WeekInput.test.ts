import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./WeekInput.svelte";

describe("WeekInput", () => {
    test("renders a week input", () => {
        render(Subject, { props: { label: "Select week" } });
        const input = screen.getByLabelText("Select week") as HTMLInputElement;
        expect(input.type).toBe("week");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Project week" } });
        expect(screen.getByLabelText("Project week")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Week", required: true } });
        expect((screen.getByLabelText("Week") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Week", disabled: true } });
        expect((screen.getByLabelText("Week") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Week", "data-testid": "wi" } });
        expect(screen.getByTestId("wi")).toBeTruthy();
    });
});
