import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBox from "./MedicalBannerBox.svelte";

describe("MedicalBannerBox", () => {
    test("renders with content", () => {
        render(MedicalBannerBox, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner-box");
    });
});
