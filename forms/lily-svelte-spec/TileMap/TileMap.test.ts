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
            children: snippet(
                '<button data-tile tabindex="0">A</button><button data-tile tabindex="-1">B</button>',
            ),
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

describe("TileMap rows", () => {
    // A 2-by-2 grid: A B on top, C D below, each tile 10 wide and 10 tall.
    function grid() {
        const { container } = render(Subject, {
            label: "Map",
            children: snippet(
                '<button data-tile tabindex="0">A</button><button data-tile tabindex="-1">B</button>' +
                    '<button data-tile tabindex="-1">C</button><button data-tile tabindex="-1">D</button>',
            ),
        });
        const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-tile]"));
        const at = [
            [0, 0],
            [10, 0],
            [0, 10],
            [10, 10],
        ];
        tiles.forEach((tile, i) => {
            const [left, top] = at[i];
            tile.getBoundingClientRect = () => ({ left, top, width: 10, height: 10 }) as DOMRect;
        });
        const press = (key: string) => {
            const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
            (document.activeElement as HTMLElement).dispatchEvent(event);
            return event;
        };
        return { tiles, press, map: container.querySelector(".tile-map") as HTMLElement };
    }

    test("ArrowDown and ArrowUp go to the nearest tile in the next or previous row", () => {
        const { tiles, press } = grid();
        tiles[1].focus();
        expect(press("ArrowDown").defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(tiles[3]);
        press("ArrowUp");
        expect(document.activeElement).toBe(tiles[1]);
        // Nothing above the top row: focus stays.
        press("ArrowUp");
        expect(document.activeElement).toBe(tiles[1]);
    });

    test("ArrowLeft and ArrowRight stop at the ends instead of wrapping", () => {
        const { tiles, press } = grid();
        tiles[0].focus();
        press("ArrowLeft");
        expect(document.activeElement).toBe(tiles[0]);
        tiles[3].focus();
        press("ArrowRight");
        expect(document.activeElement).toBe(tiles[3]);
        press("ArrowLeft");
        expect(document.activeElement).toBe(tiles[2]);
    });

    test("Escape leaves the tile; Space activates it; a key with focus outside the tiles moves nothing", () => {
        const { tiles, press, map } = grid();
        tiles[2].focus();
        let activated = 0;
        tiles[2].addEventListener("tile-activate", () => activated++);
        press(" ");
        expect(activated).toBe(1);
        press("Escape");
        expect(document.activeElement).not.toBe(tiles[2]);
        map.tabIndex = -1;
        map.focus();
        const down = new KeyboardEvent("keydown", {
            key: "ArrowDown",
            bubbles: true,
            cancelable: true,
        });
        map.dispatchEvent(down);
        expect(document.activeElement).toBe(map);
    });
});
