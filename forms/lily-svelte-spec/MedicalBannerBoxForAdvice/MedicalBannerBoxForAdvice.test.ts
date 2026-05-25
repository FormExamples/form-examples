import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";

describe("MedicalBannerBoxForAdvice", () => {
    test("renders with content", () => {
        render(MedicalBannerBoxForAdvice, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner-box-for-advice");
    });
});
