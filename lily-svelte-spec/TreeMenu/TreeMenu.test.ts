import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeMenu from "./TreeMenu.svelte";

describe("TreeMenu", () => {
    test("renders with content", () => {
        render(TreeMenu, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-menu");
    });
});
