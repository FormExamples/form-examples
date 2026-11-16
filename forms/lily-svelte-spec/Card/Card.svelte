<script lang="ts">
    // Card component
    //
    // A headless card that groups related content in a <div>, which has
    // role="group" when labelled. Supports a configurable heading level (h2-h6) for proper
    // document outline, with an optional link wrapper on the heading. Commonly used
    // for product listings, user profiles, article previews, and dashboard widgets.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   heading — string, optional. Heading text for the card.
    //   headingLevel — 2 | 3 | 4 | 5 | 6, default 3. HTML heading level.
    //   href — string, optional. Makes the heading a link.
    //   label — string, optional. Names the card, which then has role="group".
    //   children — Snippet, required. Card body content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Card><h3>Title</h3><p>Content</p></Card>
    //
    // Examples:
    //   <!-- Card with heading link -->
    //   <Card heading="Product" href="/products/1"><p>Description</p></Card>
    //
    //   <!-- Card with custom heading level and label -->
    //   <Card heading="Dashboard" headingLevel={2} label="Sales dashboard">
    //     <p>Revenue metrics</p>
    //   </Card>
    //
    // Keyboard:
    //   - Tab: Focus the heading link when href is provided
    //   - Enter: Activate the heading link (browser default)
    //
    // Accessibility:
    //   - A <div>, not an <article>: an article on every card in a list is noise. Pass role="article" for a stand-alone card
    //   - Optional label names the card as role="group"; with no label the <div> is generic and unnamed
    //   - Heading provides document outline structure at the specified level
    //
    // Internationalization:
    //   - All text comes through heading and children props; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Heading level should match the card's position in the document outline
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        heading = undefined,
        headingLevel = 3,
        href = undefined,
        label = undefined,
        children,
        ...restProps
    }: {
        heading?: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        href?: string;
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Card.svelte -->
<div
    class={`card ${className}`}
    role={label ? "group" : undefined}
    aria-label={label || undefined}
    {...restProps}
>
    {#if heading}
        {#if headingLevel === 2}
            <h2>
                {#if href}<a {href}>{heading}</a>{:else}{heading}{/if}
            </h2>
        {:else if headingLevel === 3}
            <h3>
                {#if href}<a {href}>{heading}</a>{:else}{heading}{/if}
            </h3>
        {:else if headingLevel === 4}
            <h4>
                {#if href}<a {href}>{heading}</a>{:else}{heading}{/if}
            </h4>
        {:else if headingLevel === 5}
            <h5>
                {#if href}<a {href}>{heading}</a>{:else}{heading}{/if}
            </h5>
        {:else if headingLevel === 6}
            <h6>
                {#if href}<a {href}>{heading}</a>{:else}{heading}{/if}
            </h6>
        {/if}
    {/if}
    {@render children?.()}
</div>
