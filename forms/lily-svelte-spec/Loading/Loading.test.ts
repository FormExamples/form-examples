import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Loading from "./Loading.svelte";

describe("Loading", () => {
    test("renders with content", () => {
        render(Loading, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("loading");
    });

    test("has role=status with a label", () => {
        const { container } = render(Loading, { props: { label: "Story" } as any });
        const root = container.querySelector(".loading")!;
        expect(root.getAttribute("role")).toBe("status");
        expect(root.getAttribute("aria-label")).toBe("Story");
        expect(root.getAttribute("aria-live")).toBe("polite");
    });
});
