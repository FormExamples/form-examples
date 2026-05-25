import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";

describe("IrelandIndividualHealthIdentifierInput", () => {
    test("renders with content", () => {
        render(IrelandIndividualHealthIdentifierInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ireland-individual-health-identifier-input");
    });
});
