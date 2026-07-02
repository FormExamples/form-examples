import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MaltaPassportNumberView.svelte";

describe("MaltaPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Malta Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malta-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Malta Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Malta Passport Number" } });

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el.getAttribute("aria-label")).toBe("Malta Passport Number");
    });
});
