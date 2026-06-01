import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PostalCodeView.svelte";

describe("PostalCodeView", () => {
    test("renders a span", () => {
        render(Subject, { props: { text: "90210", "data-testid": "pc" } });
        const el = screen.getByTestId("pc");
        expect(el.tagName).toBe("SPAN");
    });

    test("displays the postal code text", () => {
        render(Subject, { props: { text: "90210", "data-testid": "pc" } });
        expect(screen.getByTestId("pc").textContent).toBe("90210");
    });

    test("renders empty when no text provided", () => {
        render(Subject, { props: { "data-testid": "pc" } });
        expect(screen.getByTestId("pc").textContent).toBe("");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { text: "12345", "data-testid": "pc" } });
        expect(screen.getByTestId("pc")).toBeTruthy();
    });
});
