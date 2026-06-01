import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Tile from "./Tile.svelte";

describe("Tile", () => {
    test("renders with content", () => {
        render(Tile, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tile");
    });
});
