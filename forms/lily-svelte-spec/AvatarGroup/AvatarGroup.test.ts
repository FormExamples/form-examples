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

    test("says how many avatars it does not show, in the consumer's words, last", () => {
        render(AvatarGroup, { props: { label: "Care team", overflowLabel: "and 12 more" } as any });
        const el = screen.getByRole("group", { name: "Care team" });
        expect(el.lastElementChild?.className).toBe("avatar-group-overflow");
        expect(el.lastElementChild?.textContent).toBe("and 12 more");
    });
});
