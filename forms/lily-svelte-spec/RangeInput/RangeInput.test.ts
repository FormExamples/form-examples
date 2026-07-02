import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RangeInput.svelte";

describe("RangeInput", () => {
    test("renders a range input", () => {
        render(Subject, { props: { label: "Volume" } });
        expect(screen.getByRole("slider")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Volume" } });
        expect(screen.getByLabelText("Volume")).toBeTruthy();
    });

    test("sets min and max", () => {
        render(Subject, { props: { label: "V", min: 10, max: 200 } });
        const input = screen.getByRole("slider") as HTMLInputElement;
        expect(input.min).toBe("10");
        expect(input.max).toBe("200");
    });

    test("sets step", () => {
        render(Subject, { props: { label: "V", step: 5 } });
        expect((screen.getByRole("slider") as HTMLInputElement).step).toBe("5");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "V", disabled: true } });
        expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "V", "data-testid": "ri" } });
        expect(screen.getByTestId("ri")).toBeTruthy();
    });
});
