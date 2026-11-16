import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SuperBanner from "./SuperBanner.svelte";

describe("SuperBanner", () => {
    test("renders with content", () => {
        render(SuperBanner, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("super-banner");
    });

    test("has role=alert with a label", () => {
        const { container } = render(SuperBanner, { props: { label: "Story" } as any });
        const root = container.querySelector(".super-banner")!;
        expect(root.getAttribute("role")).toBe("alert");
        expect(root.getAttribute("aria-label")).toBe("Story");
        expect(root.getAttribute("aria-live")).toBe("assertive");
    });
});
