import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ResetInput.svelte";

describe("ResetInput", () => {
    test("renders a reset button", () => {
        render(Subject, { props: {} });
        const input = screen.getByDisplayValue("Reset") as HTMLInputElement;
        expect(input.type).toBe("reset");
    });

    test("has default value text", () => {
        render(Subject, { props: {} });
        expect(screen.getByDisplayValue("Reset")).toBeTruthy();
    });

    test("supports custom value text", () => {
        render(Subject, { props: { value: "Clear form" } });
        expect(screen.getByDisplayValue("Clear form")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true } });
        expect((screen.getByDisplayValue("Reset") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "ri" } });
        expect(screen.getByTestId("ri")).toBeTruthy();
    });
});
