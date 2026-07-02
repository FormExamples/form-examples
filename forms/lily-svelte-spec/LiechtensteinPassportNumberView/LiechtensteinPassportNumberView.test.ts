import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LiechtensteinPassportNumberView.svelte";

describe("LiechtensteinPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("liechtenstein-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number" } });

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el.getAttribute("aria-label")).toBe("Liechtenstein Passport Number");
    });
});
