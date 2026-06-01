import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Slider.svelte";

describe("Slider", () => {
    test("renders a range input (slider role)", () => {
        render(Subject, { props: { label: "Volume" } });
        expect(screen.getByRole("slider")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Brightness" } });
        expect(screen.getByLabelText("Brightness")).toBeTruthy();
    });

    test("sets min and max", () => {
        render(Subject, { props: { label: "S", min: 10, max: 200 } });
        const input = screen.getByRole("slider") as HTMLInputElement;
        expect(input.min).toBe("10");
        expect(input.max).toBe("200");
    });

    test("sets step", () => {
        render(Subject, { props: { label: "S", step: 5 } });
        expect((screen.getByRole("slider") as HTMLInputElement).step).toBe("5");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "S", disabled: true } });
        expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sl" } });
        expect(screen.getByTestId("sl")).toBeTruthy();
    });
});
