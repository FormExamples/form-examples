<script lang="ts">
    // ButtonGroup component
    //
    // A headless wrapper that groups related buttons together as a single
    // landmark for assistive technology. Renders a `<div>` with `role="group"`
    // and a REQUIRED `aria-label` so screen readers announce the group's
    // purpose. The group has no behavior of its own — children remain
    // independent buttons.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label naming the group.
    //   children — Snippet, required. The grouped buttons.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ButtonGroup label="Edit actions">…</ButtonGroup>
    //
    // Examples:
    //   <ButtonGroup label="Pagination controls">
    //     <button>Previous</button>
    //     <button>Next</button>
    //   </ButtonGroup>
    //
    // Accessibility:
    //   - role="group" plus aria-label provide grouping semantics
    //   - Children remain independent buttons with their own focus/keyboard
    //
    // Internationalization:
    //   - label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label is REQUIRED
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
    //   - USWDS Button group: https://designsystem.digital.gov/components/button-group/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Accessible label for the group (REQUIRED) */
        label: string;
        /** Grouped button content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ButtonGroup.svelte -->
<div
    class={`button-group ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
