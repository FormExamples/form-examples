import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AvatarGroup from "./AvatarGroup.svelte";

describe("AvatarGroup", () => {
    test("renders with content", () => {
        render(AvatarGroup, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("avatar-group");
    });

    test("has role=group with a label", () => {
        const { container } = render(AvatarGroup, { props: { label: "Story" } as any });
        const root = container.querySelector(".avatar-group")!;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
