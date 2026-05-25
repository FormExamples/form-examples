import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeListItem from "./TreeListItem.svelte";

describe("TreeListItem", () => {
    test("renders with content", () => {
        render(TreeListItem, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-list-item");
    });
});
