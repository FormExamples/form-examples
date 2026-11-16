import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AddressographBox from "./AddressographBox.svelte";

describe("AddressographBox", () => {
    test("renders with content", () => {
        render(AddressographBox, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("addressograph-box");
    });

    test("is a named group when labelled", () => {
        const { container } = render(AddressographBox, { props: { label: "Story" } as any });
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(AddressographBox, { props: {} as any });
        expect(container.querySelector(".addressograph-box")?.hasAttribute("role")).toBe(false);
    });
});
