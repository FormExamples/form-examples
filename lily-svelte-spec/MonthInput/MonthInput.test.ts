import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MonthInput.svelte";

describe("MonthInput", () => {
    test("renders a month input", () => {
        render(Subject, { props: { label: "Month" } });
        expect((screen.getByLabelText("Month") as HTMLInputElement).type).toBe("month");
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Month", required: true } });
        expect((screen.getByLabelText("Month") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Month", disabled: true } });
        expect((screen.getByLabelText("Month") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "M", "data-testid": "mi" } });
        expect(screen.getByTestId("mi")).toBeTruthy();
    });
});
