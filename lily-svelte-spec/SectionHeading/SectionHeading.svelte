<script lang="ts">
    // SectionHeading component
    //
    // A styled heading introducing a major content section, with optional
    // eyebrow and subtitle. Renders a native <header> containing an optional
    // eyebrow paragraph, a heading at level 2-6, and an optional subtitle
    // paragraph.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   heading — string, REQUIRED. Main heading text.
    //   eyebrow — string, optional. Eyebrow text rendered above the heading.
    //   subtitle — string, optional. Subtitle text below the heading.
    //   level — 2 | 3 | 4 | 5 | 6, default 2. Heading level.
    //   ...restProps — additional HTML attributes spread onto the <header>.
    //
    // Syntax:
    //   <SectionHeading eyebrow="Updates" heading="Latest news" subtitle="What we shipped this week" level={2} />
    //
    // Accessibility:
    //   - <header> semantics
    //   - Heading element provides hierarchical semantics
    //
    // Internationalization:
    //   - All text via props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - heading is REQUIRED — TypeScript reflects this

    let {
        class: className = "",
        heading,
        eyebrow = undefined,
        subtitle = undefined,
        level = 2,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** Main heading text (REQUIRED) */
        heading: string;
        /** Eyebrow text rendered above the heading */
        eyebrow?: string;
        /** Subtitle text below the heading */
        subtitle?: string;
        /** Heading level */
        level?: 2 | 3 | 4 | 5 | 6;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SectionHeading.svelte -->
<header
    class={`section-heading ${className}`}
    {...restProps}
>
    {#if eyebrow}
        <p class="section-heading-eyebrow">{eyebrow}</p>
    {/if}
    {#if level === 2}
        <h2 class="section-heading-heading">{heading}</h2>
    {:else if level === 3}
        <h3 class="section-heading-heading">{heading}</h3>
    {:else if level === 4}
        <h4 class="section-heading-heading">{heading}</h4>
    {:else if level === 5}
        <h5 class="section-heading-heading">{heading}</h5>
    {:else}
        <h6 class="section-heading-heading">{heading}</h6>
    {/if}
    {#if subtitle}
        <p class="section-heading-subtitle">{subtitle}</p>
    {/if}
</header>
