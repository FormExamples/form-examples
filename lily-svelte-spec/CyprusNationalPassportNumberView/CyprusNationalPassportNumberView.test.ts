import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CyprusNationalPassportNumberView.svelte";

describe("CyprusNationalPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("National Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cyprus-national-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Passport Number", value: "test-value" } });

        const el = screen.getByLabelText("National Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Passport Number" } });

        const el = screen.getByLabelText("National Passport Number");
        expect(el.getAttribute("aria-label")).toBe("National Passport Number");
    });
});
