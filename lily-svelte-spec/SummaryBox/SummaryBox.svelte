<script lang="ts">
    // SummaryBox component
    //
    // A headless `<aside>` callout that highlights key takeaways or next
    // steps from a longer page. Inspired by the USWDS Summary box. The
    // REQUIRED heading becomes both the visible title and (by default) the
    // `aria-label` of the complementary landmark; consumers may override the
    // label via the `label` prop.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   heading — string, REQUIRED. Box heading.
    //   label — string, optional. aria-label override (defaults to heading).
    //   children — Snippet, optional. Body content.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <SummaryBox heading="Key takeaways">…</SummaryBox>
    //
    // Accessibility:
    //   - <aside> is a complementary landmark with aria-label
    //   - Heading is <h3>; consumer manages overall heading hierarchy
    //
    // Internationalization:
    //   - heading and label come from props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - heading is REQUIRED

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        heading,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Box heading (REQUIRED) */
        heading: string;
        /** Optional aria-label override; defaults to heading */
        label?: string;
        /** Optional body content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SummaryBox.svelte -->
<aside
    class={`summary-box ${className}`}
    aria-label={label ?? heading}
    {...restProps}
>
    <h3 class="summary-box-heading">{heading}</h3>
    <div class="summary-box-body">
        {#if children}
            {@render children?.()}
        {/if}
    </div>
</aside>
