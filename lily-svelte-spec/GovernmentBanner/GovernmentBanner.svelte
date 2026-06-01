<script lang="ts">
    // GovernmentBanner component
    //
    // A headless `<aside>` identifying a website as belonging to a government.
    // Includes an expandable details panel toggled by a button. Inspired by
    // the USWDS Banner pattern. The banner is a complementary landmark and
    // exposes `aria-expanded` plus `aria-controls` on the toggle, with a
    // stable id wiring the button to the panel.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label naming the banner.
    //   headerText — string, REQUIRED. Top headline text.
    //   expandLabel — string, REQUIRED. Toggle button text.
    //   expanded — boolean, default false. Whether the panel is open.
    //   ontoggle — (next: boolean) => void, optional. Toggle handler.
    //   panelId — string, optional. Stable id for the panel; auto-generated otherwise.
    //   children — Snippet, optional. Details panel content.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <GovernmentBanner
    //     label="Official government website"
    //     headerText="An official website of the United States government"
    //     expandLabel="Here's how you know"
    //   >…</GovernmentBanner>
    //
    // Accessibility:
    //   - <aside> is a complementary landmark
    //   - Toggle button uses aria-expanded and aria-controls
    //   - Panel is hidden with the boolean `hidden` attribute when collapsed
    //
    // Internationalization:
    //   - All text is consumer-supplied via props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label, headerText, expandLabel are REQUIRED
    //   - Stable panel id is generated when not supplied

    import type { Snippet } from "svelte";

    function makePanelId(): string {
        try {
            // Prefer crypto.randomUUID when available
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cryptoLocal = (globalThis as any).crypto;
            if (cryptoLocal?.randomUUID) {
                return `government-banner-panel-${cryptoLocal.randomUUID()}`;
            }
        } catch {
            // ignore and fall through
        }
        return `government-banner-panel-${Math.random().toString(36).slice(2, 10)}`;
    }

    let {
        class: className = "",
        label,
        headerText,
        expandLabel,
        expanded = false,
        ontoggle = undefined,
        panelId = makePanelId(),
        children = undefined,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Accessible label naming the banner (REQUIRED) */
        label: string;
        /** Top headline text (REQUIRED) */
        headerText: string;
        /** Toggle button text (REQUIRED) */
        expandLabel: string;
        /** Whether the panel is expanded */
        expanded?: boolean;
        /** Toggle handler invoked with the next expanded state */
        ontoggle?: (next: boolean) => void;
        /** Stable id for the details panel */
        panelId?: string;
        /** Optional details panel content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    function handleToggle() {
        const next = !expanded;
        ontoggle?.(next);
    }
</script>

<!-- GovernmentBanner.svelte -->
<aside
    class={`government-banner ${className}`}
    aria-label={label}
    {...restProps}
>
    <header class="government-banner-header">
        <span class="government-banner-headline">{headerText}</span>
        <button
            type="button"
            class="government-banner-toggle"
            aria-expanded={expanded}
            aria-controls={panelId}
            onclick={handleToggle}
        >
            {expandLabel}
        </button>
    </header>
    <div
        class="government-banner-details"
        id={panelId}
        hidden={!expanded}
    >
        {#if children}
            {@render children?.()}
        {/if}
    </div>
</aside>
