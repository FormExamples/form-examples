<script lang="ts">
    // TabPanel component
    //
    // A content panel associated with a tab in a tab bar. Renders a `<div>`
    // with `role="tabpanel"`. When `labelledBy` is provided, the panel uses
    // `aria-labelledby` to point at the controlling tab; otherwise it falls
    // back to the required `label` prop as `aria-label`. The panel is hidden
    // (via the native `hidden` attribute) when not selected and is focusable
    // via `tabindex="0"` so keyboard users can scroll the content.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label fallback when labelledBy is absent.
    //   labelledBy — string, optional. ID of the controlling tab button.
    //   selected — boolean, default false. Whether the panel is selected.
    //   children — Snippet, optional. Panel content.
    //
    // Syntax:
    //   <TabPanel label="Details" labelledBy="tab-details" selected={current === "details"}>
    //       …
    //   </TabPanel>
    //
    // Accessibility:
    //   - role="tabpanel"
    //   - aria-labelledby links to the controlling tab when provided
    //   - tabindex="0" makes the panel focusable for keyboard users
    //
    // Internationalization:
    //   - Label provided via props
    //
    // References:
    //   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        labelledBy = undefined,
        selected = false,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label fallback (REQUIRED) */
        label: string;
        /** ID of the controlling tab button */
        labelledBy?: string;
        /** Whether the panel is selected */
        selected?: boolean;
        /** Panel content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TabPanel.svelte -->
<div
    class={`tab-panel ${className}`}
    role="tabpanel"
    aria-label={labelledBy ? undefined : label}
    aria-labelledby={labelledBy}
    hidden={!selected}
    tabindex="0"
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</div>
