import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaIndividualHealthcareIdentifierView.svelte";

describe("AustraliaIndividualHealthcareIdentifierView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Individual Healthcare Identifier", value: "test-value" } });

        const el = screen.getByLabelText("Individual Healthcare Identifier");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("australia-individual-healthcare-identifier-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Individual Healthcare Identifier", value: "test-value" } });

        const el = screen.getByLabelText("Individual Healthcare Identifier");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Healthcare Identifier" } });

        const el = screen.getByLabelText("Individual Healthcare Identifier");
        expect(el.getAttribute("aria-label")).toBe("Individual Healthcare Identifier");
    });
});
