import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AvatarGroup from "./AvatarGroup.svelte";

describe("AvatarGroup", () => {
    test("renders with content", () => {
        render(AvatarGroup, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("avatar-group");
    });
});
