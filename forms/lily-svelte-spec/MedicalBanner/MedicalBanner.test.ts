import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBanner from "./MedicalBanner.svelte";

describe("MedicalBanner", () => {
    test("renders with content", () => {
        render(MedicalBanner, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner");
    });
});
