import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeLink from "./TreeLink.svelte";

describe("TreeLink", () => {
    test("renders with content", () => {
        render(TreeLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-link");
    });
});
