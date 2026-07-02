import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TimeInput.svelte";

describe("TimeInput", () => {
    test("renders a time input", () => {
        render(Subject, { props: { label: "Start time" } });
        const input = screen.getByLabelText("Start time") as HTMLInputElement;
        expect(input.type).toBe("time");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Meeting time" } });
        expect(screen.getByLabelText("Meeting time")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Time", required: true } });
        expect((screen.getByLabelText("Time") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Time", disabled: true } });
        expect((screen.getByLabelText("Time") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Time", "data-testid": "ti" } });
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
