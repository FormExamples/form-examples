<script lang="ts">
    // TileMap component
    //
    // Tile cartogram. Headless arrow-key navigation between [data-tile]
    // children; Enter/Space dispatch tile-activate; Escape blurs.

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
