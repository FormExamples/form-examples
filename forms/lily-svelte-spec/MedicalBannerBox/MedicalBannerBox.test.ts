import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MedicalBannerBox from "./MedicalBannerBox.svelte";

describe("MedicalBannerBox", () => {
    test("renders with content", () => {
        render(MedicalBannerBox, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("medical-banner-box");
    });

    test("is a named group when labelled", () => {
        const { container } = render(MedicalBannerBox, { props: { label: "Story" } as any });
        const root = container.querySelector(".medical-banner-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(MedicalBannerBox, { props: {} as any });
        expect(container.querySelector(".medical-banner-box")?.hasAttribute("role")).toBe(false);
    });
});
