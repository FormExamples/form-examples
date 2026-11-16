<script lang="ts">
    // Listbox component
    //
    // A headless listbox that presents a list of selectable options using the ARIA
    // listbox role with full keyboard navigation. Two navigation models, chosen via
    // `navigation`:
    //
    //   "roving-focus" (default, unchanged since this component's introduction) —
    //   real DOM focus moves between child `[role="option"]` elements; arrows wrap
    //   at the ends; no typeahead, paging, or activation callback.
    //
    //   "active-descendant" (added for consumers needing the full WAI-ARIA APG
    //   listbox keyboard contract, e.g. an icon-button-triggered picker) — the
    //   listbox root itself holds real focus and tracks a virtual cursor via
    //   `aria-activedescendant`, mirroring `activeIndex` (bindable) so the
    //   consumer's own each-block can render `data-active`/`aria-selected` on the
    //   option at that index. Adds `clamp` (vs. wrap), typeahead, PageUp/PageDown
    //   paging, and `onActivate`/`onEscape`/`onTabOut` callbacks so the consumer
    //   decides what "select" / "cancel" / "leave" actually do.
    //
    // Used when users need to select one or more items from a visible list, such
    // as settings panels, filter selections, or multi-select interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   children — Snippet, required. Option elements (should have role="option" and tabindex="-1").
    //   navigation — "roving-focus" | "active-descendant", default "roving-focus".
    //   ref — HTMLElement | undefined, bindable. The rendered root, for a consumer
    //     that needs to call .focus() on it (active-descendant mode only).
    //   activeIndex — number, bindable, default -1. The virtual cursor position
    //     (active-descendant mode only); -1 means no option is active.
    //   clamp — boolean, default false. Arrow keys clamp at the ends instead of
    //     wrapping (active-descendant mode only; roving-focus always wraps).
    //   typeahead — boolean, default false. Printable characters move the cursor
    //     to the next option whose text starts with the typed buffer, cycling on a
    //     repeated character (active-descendant mode only).
    //   pageSize — number, default 10. PageUp/PageDown move the cursor by this
    //     many options, clamped (active-descendant mode only).
    //   onActivate — (index: number) => void, optional. Enter/Space on the active
    //     option (active-descendant mode only).
    //   onEscape — () => void, optional. Escape pressed (active-descendant mode only).
    //   onTabOut — (event: KeyboardEvent) => void, optional. Tab pressed, called
    //     BEFORE the browser processes the key (not prevented) so the consumer can
    //     move focus first — e.g. to the trigger button — before Tab's default
    //     action computes the next stop from wherever focus ends up (active-descendant mode only).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Listbox label="Fruits">
    //     <div role="option" tabindex="-1">Apple</div>
    //   </Listbox>
    //
    // Examples:
    //   <!-- Basic listbox with static options (roving-focus, unchanged default) -->
    //   <Listbox label="Fruits">
    //     <div role="option" tabindex="-1">Apple</div>
    //     <div role="option" tabindex="-1">Banana</div>
    //   </Listbox>
    //
    //   <!-- active-descendant mode: consumer owns rendering each option's
    //        id/aria-selected/data-active from the bound activeIndex -->
    //   <Listbox
    //     label="Fruits"
    //     navigation="active-descendant"
    //     clamp
    //     bind:activeIndex
    //     onActivate={(i) => choose(fruits[i])}
    //   >
    //     {#each fruits as fruit, i}
    //       <div role="option" id={`fruit-${i}`} aria-selected={i === activeIndex}
    //         data-active={i === activeIndex ? "" : undefined}>{fruit}</div>
    //     {/each}
    //   </Listbox>
    //
    // Keyboard:
    //   roving-focus: ArrowDown/ArrowUp move focus and wrap; Home/End jump.
    //   active-descendant: ArrowDown/ArrowUp move the cursor (wrap unless `clamp`);
    //     Home/End jump; PageUp/PageDown move by `pageSize` (clamped); typeahead
    //     when `typeahead` is set; Enter/Space calls `onActivate`; Escape calls
    //     `onEscape`; Tab calls `onTabOut` without being prevented.
    //
    // Accessibility:
    //   - role="listbox" identifies the container as a listbox widget
    //   - aria-label provides an accessible name describing the listbox purpose
    //   - roving-focus: child elements should use role="option" and optionally aria-selected
    //   - active-descendant: the root carries aria-activedescendant and tabindex="-1";
    //     the consumer's option elements carry the matching id
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All option content comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - roving-focus (default): arrow keys wrap around at boundaries, consumer
    //     handles selection state externally — unchanged from this component's
    //     original behaviour, so existing consumers of the default mode see no
    //     difference.
    //   - active-descendant: opt-in via `navigation="active-descendant"`; every
    //     new prop is inert unless that mode is selected.
    //
    // References:
    //   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { initialListboxState, listboxKeydown } from "./listbox-machine";

    let {
        class: className = "",
        baseClass = "listbox",
        as = "div",
        label,
        children,
        navigation = "roving-focus",
        ref = $bindable<HTMLElement | undefined>(undefined),
        activeIndex = $bindable(-1),
        clamp = false,
        typeahead = false,
        pageSize = 10,
        onActivate,
        onEscape,
        onTabOut,
        ...restProps
    }: {
        /** Base class token, replacing "listbox" outright (not appended). */
        baseClass?: string;
        /** Root element tag. Default "div" (unchanged). A consumer whose spec
         * requires e.g. a `<ul>` root sets `as="ul"`. */
        as?: string;
        /** Accessible label. */
        label: string;
        /** Option elements. */
        children: Snippet;
        /** Navigation/focus model. Default "roving-focus" (unchanged legacy behaviour). */
        navigation?: "roving-focus" | "active-descendant";
        /** The rendered root element. Bindable. */
        ref?: HTMLElement;
        /** Virtual cursor position (active-descendant mode). Bindable, -1 = none. */
        activeIndex?: number;
        /** Arrow keys clamp instead of wrap (active-descendant mode). */
        clamp?: boolean;
        /** Printable-character typeahead (active-descendant mode). */
        typeahead?: boolean;
        /** PageUp/PageDown step size (active-descendant mode). */
        pageSize?: number;
        /** Enter/Space on the active option (active-descendant mode). */
        onActivate?: (index: number) => void;
        /** Escape pressed (active-descendant mode). */
        onEscape?: () => void;
        /** Tab pressed, called before the key is processed (active-descendant mode). */
        onTabOut?: (event: KeyboardEvent) => void;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Listbox", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    // Every keyboard decision lives in the framework-free machine (shared/listbox-machine.ts, copied here by
    // bin/sync-shared-modules); this component only reads the DOM and applies the transition it returns.
    function options(): HTMLElement[] {
        return ref ? Array.from(ref.querySelectorAll<HTMLElement>("[role='option']")) : [];
    }

    let typeaheadState = initialListboxState().typeahead;

    function onkeydown(event: KeyboardEvent) {
        const opts = options();
        const t = listboxKeydown(
            { activeIndex, typeahead: typeaheadState },
            event,
            {
                labels: opts.map((option) => (option.textContent ?? "").trim()),
                focusedIndex: opts.indexOf(document.activeElement as HTMLElement),
                now: Date.now(),
            },
            { navigation, clamp, typeahead, pageSize },
        );
        typeaheadState = t.state.typeahead;
        if (t.preventDefault) event.preventDefault();
        if (t.focus !== undefined) opts[t.focus]?.focus();
        if (t.setActiveIndex !== undefined) activeIndex = t.setActiveIndex;
        if (t.activate !== undefined) onActivate?.(t.activate);
        if (t.escape) onEscape?.();
        if (t.tabOut) onTabOut?.(event); // never prevented: Tab proceeds from wherever onTabOut leaves focus
    }

    const activeId = $derived.by(() => {
        if (navigation !== "active-descendant" || activeIndex < 0) return undefined;
        return options()[activeIndex]?.id || undefined;
    });
</script>

<!-- Listbox.svelte -->
<svelte:element
    this={as}
    class={`${baseClass} ${className}`}
    role="listbox"
    aria-label={label}
    tabindex={navigation === "active-descendant" ? -1 : undefined}
    aria-activedescendant={activeId}
    bind:this={ref}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</svelte:element>
