import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EireIndividualHealthIdentifierInput from "./EireIndividualHealthIdentifierInput.svelte";

describe("EireIndividualHealthIdentifierInput", () => {
    test("renders with content", () => {
        render(EireIndividualHealthIdentifierInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("eire-individual-health-identifier-input");
    });
});
