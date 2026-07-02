<script lang="ts">
    // InfoState component
    //
    // A headless composition of optional illustration, required title, optional
    // description, and optional action — useful for empty states, error states,
    // success states, and informational placeholder views. Renders a `<section>`
    // with role="status" and a configurable `data-level`.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   level — "info" | "empty" | "error" | "success", default "info". Sets data-level.
    //   title — string, REQUIRED. Section heading text.
    //   description — string, optional. Body text.
    //   label — string, optional. aria-label override (defaults to title).
    //   illustration — Snippet, optional. Visual element above title.
    //   action — Snippet, optional. CTA button(s) below description.
    //   children — Snippet, optional. Custom default content.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // Syntax:
    //   <InfoState level="empty" title="No results" description="Try a different filter." />
    //
    // Examples:
    //   <InfoState level="error" title="Something went wrong" description={msg}>
    //     {#snippet action()}<button onclick={retry}>Retry</button>{/snippet}
    //   </InfoState>
    //
    // Keyboard:
    //   - None on the container; any action snippet provides interactivity
    //
    // Accessibility:
    //   - role="status" announces non-disruptive updates
    //   - aria-label defaults to title text
    //
    // Internationalization:
    //   - title, description, label all come from props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - level only sets data-level for consumer CSS hooks
    //
    // References:
    //   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
    //   - WAI-ARIA role="status": https://www.w3.org/WAI/ARIA/apg/patterns/alert/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        level = "info",
        title,
        description = undefined,
        label = undefined,
        illustration = undefined,
        action = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Level of the info state */
        level?: "info" | "empty" | "error" | "success";
        /** Section heading text (required) */
        title: string;
        /** Body description */
        description?: string;
        /** aria-label override (defaults to title) */
        label?: string;
        /** Illustration above title */
        illustration?: Snippet;
        /** Action(s) below description */
        action?: Snippet;
        /** Custom default content (alternative to title/description/action) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- InfoState.svelte -->
<section
    class={`info-state ${className}`}
    role="status"
    data-level={level}
    aria-label={label || title}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {:else}
        {#if illustration}
            <div class="info-state-illustration">{@render illustration()}</div>
        {/if}
        <h2 class="info-state-title">{title}</h2>
        {#if description}
            <p class="info-state-description">{description}</p>
        {/if}
        {#if action}
            <div class="info-state-action">{@render action()}</div>
        {/if}
    {/if}
</section>
