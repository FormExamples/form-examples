<script lang="ts">
    // SplitView component
    //
    // A two-panel resizable layout container with a draggable divider between
    // them. Renders a `<div>` with two `<section>` panels and either a custom
    // divider snippet or a default `<div role="separator">`.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the container.
    //   orientation — "horizontal" | "vertical", default "horizontal".
    //   primary — Snippet, REQUIRED. First panel content.
    //   secondary — Snippet, REQUIRED. Second panel content.
    //   divider — Snippet, optional. Custom divider content.
    //   splitPercent — number 0-100, default 50.
    //
    // Syntax:
    //   <SplitView label="Editor and preview">
    //       {#snippet primary()}…{/snippet}
    //       {#snippet secondary()}…{/snippet}
    //   </SplitView>
    //
    // Accessibility:
    //   - Default divider has role="separator", aria-orientation,
    //     aria-valuenow / aria-valuemin / aria-valuemax, tabindex="0".
    //
    // Internationalization:
    //   - All user-facing strings via props
    //
    // References:
    //   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

    import type { Snippet } from "svelte";
    import { attachSplitView } from "../widget-keys";

    let {
        class: className = "",
        label,
        orientation = "horizontal",
        primary,
        secondary,
        divider = undefined,
        splitPercent = $bindable(50),
        onSplitChange = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the container (REQUIRED) */
        label: string;
        /** Orientation of the divider */
        orientation?: "horizontal" | "vertical";
        /** First panel content (REQUIRED) */
        primary: Snippet;
        /** Second panel content (REQUIRED) */
        secondary: Snippet;
        /** Custom divider content */
        divider?: Snippet;
        /** Initial split position as percentage (0-100) */
        splitPercent?: number;
        /** Called with each new position */
        onSplitChange?: (value: number) => void;
        [key: string]: unknown;
    } = $props();

    let rootEl = $state<HTMLElement>();

    $effect(() =>
        rootEl
            ? attachSplitView(rootEl, {
                  onChange(next) {
                      splitPercent = next;
                      onSplitChange?.(next);
                  },
              })
            : undefined,
    );
</script>

<!-- SplitView.svelte -->
<div
    bind:this={rootEl}
    class={`split-view ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    data-orientation={orientation}
    data-split-percent={splitPercent}
    {...restProps}
>
    <section class="split-view-primary">
        {@render primary()}
    </section>
    {#if divider}
        {@render divider()}
    {:else}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (a focusable separator is the WAI-ARIA window splitter pattern) -->
        <div
            class="split-view-divider"
            role="separator"
            aria-orientation={orientation}
            aria-valuenow={splitPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            tabindex="0"
        ></div>
    {/if}
    <section class="split-view-secondary">
        {@render secondary()}
    </section>
</div>
