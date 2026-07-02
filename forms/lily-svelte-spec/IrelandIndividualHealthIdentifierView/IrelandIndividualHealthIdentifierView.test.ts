import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";

describe("IrelandIndividualHealthIdentifierView", () => {
    test("renders with content", () => {
        render(IrelandIndividualHealthIdentifierView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ireland-individual-health-identifier-view");
    });
});
