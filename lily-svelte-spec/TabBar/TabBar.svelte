<script lang="ts">
    // TabBar component
    //
    // A headless tab bar container using the ARIA tablist role. It renders a <div>
    // with role="tablist" and manages horizontal focus movement between tab buttons
    // via ArrowLeft/ArrowRight keys. Each tab button controls a corresponding
    // tabpanel. Commonly used for navigation between content sections.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   children — Snippet, required. TabBarButton elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <TabBar label="Settings">
    //     <TabBarButton selected controls="panel-1">General</TabBarButton>
    //   </TabBar>
    //
    // Examples:
    //   <!-- Tab bar with multiple tabs -->
    //   <TabBar label="Settings">
    //     <TabBarButton selected={activeTab === "general"} controls="panel-general"
    //       onclick={() => activeTab = "general"}>General</TabBarButton>
    //     <TabBarButton selected={activeTab === "advanced"} controls="panel-advanced"
    //       onclick={() => activeTab = "advanced"}>Advanced</TabBarButton>
    //   </TabBar>
    //
    // Keyboard:
    //   - ArrowRight: move focus to next tab, wrapping from last to first
    //   - ArrowLeft: move focus to previous tab, wrapping from first to last
    //   - Home: move focus to the first tab
    //   - End: move focus to the last tab
    //
    // Accessibility:
    //   - role="tablist" identifies the container as a tab list widget
    //   - aria-label provides an accessible name describing the tab bar purpose
    //   - Child TabBarButton elements provide role="tab" with roving tabindex
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All tab content comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with TabBarButton
    //   - Uses horizontal (ArrowLeft/ArrowRight) navigation
    //   - Arrow keys wrap around at boundaries
    //
    // References:
    //   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** TabBarButton elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let barRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!barRef) return;
        const items = Array.from(
            barRef.querySelectorAll<HTMLElement>("[role='tab']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    }
</script>

<!-- TabBar.svelte -->
<div
    class={`tab-bar ${className}`}
    role="tablist"
    aria-label={label}
    bind:this={barRef}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
