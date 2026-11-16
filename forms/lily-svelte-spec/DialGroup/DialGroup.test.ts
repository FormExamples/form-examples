import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DialGroup from "./DialGroup.svelte";

describe("DialGroup", () => {
    test("renders with content", () => {
        render(DialGroup, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("dial-group");
    });

    test("has role=group with a label", () => {
        const { container } = render(DialGroup, { props: { label: "Story" } as any });
        const root = container.querySelector(".dial-group")!;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
