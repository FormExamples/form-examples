<script lang="ts">
    // TileMap component
    //
    // A tile cartogram: a grid of equal tiles standing for regions. Headless arrow-key navigation between
    // the `[data-tile]` descendants, Enter or Space dispatches a bubbling `tile-activate` event on the
    // focused tile, and Escape blurs it. The tiles themselves are the consumer's elements.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name. Rendered as aria-label.
    //   children — Snippet, required. The content. Elements marked with a data-tile attribute are the navigable tiles.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <TileMap label="…"><button data-tile>…</button>…</TileMap>
    //
    // Examples:
    //   <TileMap label="Regions of the country"><button data-tile>North</button><button data-tile>South</button></TileMap>
    //
    // Keyboard:
    //   - ArrowRight / ArrowLeft: next / previous tile in document order, clamped at the ends
    //   - ArrowDown / ArrowUp: the nearest tile in the row below / above, by horizontal centre then vertical distance
    //   - Enter or Space: dispatches a bubbling `tile-activate` CustomEvent on the focused tile
    //   - Escape: removes focus from the tile
    //   - Tiles need tabindex (for example a <button>) to receive focus
    //
    // Accessibility:
    //   - role="img" with aria-roledescription="tile map" and aria-label from `label`
    //   - role="img" makes descendants presentational, which conflicts with focusable tiles inside it; give the data in an accessible table beside the map, as the chart pattern does (known issue)
    //   - Do not use colour alone to show a tile's value (WCAG 1.4.1)
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Keys are physical (ArrowRight is next in document order), not mirrored for right-to-left
    //
    // References:
    //   - Reuters Graphics TileMap (the inspiration): https://github.com/reuters-graphics/graphics-components
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("TileMap", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let tileMapEl: HTMLDivElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        const root = tileMapEl;
        if (!root) return;
        const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
        if (tiles.length === 0) return;
        const focused = document.activeElement as HTMLElement | null;
        const idx = focused ? tiles.indexOf(focused) : -1;

        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                tiles[Math.min(tiles.length - 1, idx + 1)]?.focus();
                break;
            case "ArrowLeft":
                event.preventDefault();
                tiles[Math.max(0, idx - 1)]?.focus();
                break;
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (idx === -1) return;
                const current = tiles[idx];
                const currentRect = current.getBoundingClientRect();
                const targetX = currentRect.left + currentRect.width / 2;
                const wantBelow = event.key === "ArrowDown";
                const next = tiles
                    .map((t, i) => ({ t, i }))
                    .filter(({ i }) => i !== idx)
                    .filter(({ t }) => {
                        const r = t.getBoundingClientRect();
                        return wantBelow ? r.top > currentRect.top : r.top < currentRect.top;
                    })
                    .map(({ t }) => {
                        const r = t.getBoundingClientRect();
                        const dx = Math.abs(r.left + r.width / 2 - targetX);
                        const dy = Math.abs(r.top - currentRect.top);
                        return { t, score: dx + dy };
                    })
                    .sort((a, b) => a.score - b.score)[0]?.t;
                next?.focus();
                break;
            }
            case "Enter":
            case " ":
                event.preventDefault();
                focused?.dispatchEvent(new CustomEvent("tile-activate", { bubbles: true }));
                break;
            case "Escape":
                event.preventDefault();
                focused?.blur();
                break;
        }
    }
</script>

<!-- TileMap.svelte -->
<div
    bind:this={tileMapEl}
    class={`tile-map ${className}`}
    role="img"
    aria-label={label}
    aria-roledescription="tile map"
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
