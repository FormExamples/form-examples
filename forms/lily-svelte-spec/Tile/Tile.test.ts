import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Tile from "./Tile.svelte";

describe("Tile", () => {
    test("renders with content", () => {
        render(Tile, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tile");
    });

    test("has role=group with a label", () => {
        const { container } = render(Tile, { props: { label: "Story" } as any });
        const root = container.querySelector(".tile")!;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
