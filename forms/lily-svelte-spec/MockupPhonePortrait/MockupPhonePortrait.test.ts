import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupPhonePortrait from "./MockupPhonePortrait.svelte";

describe("MockupPhonePortrait", () => {
    test("renders with content", () => {
        render(MockupPhonePortrait, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-phone-portrait");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupPhonePortrait, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-phone-portrait")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
