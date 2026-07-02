import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";

describe("MedicalBannerBoxForDanger", () => {
    test("renders with content", () => {
        render(MedicalBannerBoxForDanger, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner-box-for-danger");
    });
});
