import { render } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TileMap.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("TileMap", () => {
    test("renders a div with class tile-map", () => {
        const { container } = render(Subject, { label: "USA tile map", children: snippet("x") });
        const root = container.querySelector(".tile-map");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=img with aria-label and aria-roledescription", () => {
        const { container } = render(Subject, { label: "USA tile map", children: snippet("x") });
        const map = container.querySelector(".tile-map");
        expect(map?.getAttribute("role")).toBe("img");
        expect(map?.getAttribute("aria-label")).toBe("USA tile map");
        expect(map?.getAttribute("aria-roledescription")).toBe("tile map");
    });

    test("ArrowRight moves focus to the next tile", () => {
        const { container } = render(Subject, {
            label: "x",
            children: snippet('<button data-tile tabindex="0">A</button><button data-tile tabindex="-1">B</button>'),
        });
        const tiles = Array.from(container.querySelectorAll("[data-tile]")) as HTMLElement[];
        tiles[0].focus();
        const map = container.querySelector(".tile-map") as HTMLDivElement;
        map.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tiles[1]);
    });

    test("Enter dispatches a tile-activate event on the focused tile", () => {
        const { container } = render(Subject, {
            label: "x",
            children: snippet('<button data-tile tabindex="0">A</button>'),
        });
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        const handler = vi.fn();
        tile.addEventListener("tile-activate", handler);
        tile.focus();
        const map = container.querySelector(".tile-map") as HTMLDivElement;
        map.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        expect(handler).toHaveBeenCalledOnce();
    });

    test("Escape blurs the focused tile", () => {
        const { container } = render(Subject, {
            label: "x",
            children: snippet('<button data-tile tabindex="0">A</button>'),
        });
        const tile = container.querySelector("[data-tile]") as HTMLElement;
        tile.focus();
        expect(document.activeElement).toBe(tile);
        const map = container.querySelector(".tile-map") as HTMLDivElement;
        map.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(document.activeElement).not.toBe(tile);
    });
});
