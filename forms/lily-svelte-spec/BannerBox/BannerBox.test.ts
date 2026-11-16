import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BannerBox from "./BannerBox.svelte";

describe("BannerBox", () => {
    test("renders with content", () => {
        render(BannerBox, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("banner-box");
    });

    test("is a named group when labelled", () => {
        const { container } = render(BannerBox, { props: { label: "Story" } as any });
        const root = container.querySelector(".banner-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(BannerBox, { props: {} as any });
        expect(container.querySelector(".banner-box")?.hasAttribute("role")).toBe(false);
    });
});
