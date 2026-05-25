<script lang="ts">
    // CareCard component
    //
    // A headless healthcare guidance component inspired by NHS England care card
    // patterns. Renders a <section> landmark with a heading and body content,
    // supporting three urgency tiers: non-urgent (speak to a GP), urgent (visit
    // A&E or call 111), and immediate (call 999). The data-type attribute enables
    // consumer CSS styling based on urgency level.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type — "non-urgent" | "urgent" | "immediate", default "non-urgent". Urgency level.
    //   heading — string, required. Heading text describing the care action.
    //   label — string, optional. aria-label override; defaults to heading text.
    //   children — Snippet, required. The care card body content.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // Syntax:
    //   <CareCard heading="See a GP if:">
    //     <p>You have persistent symptoms.</p>
    //   </CareCard>
    //
    // Examples:
    //   <!-- Non-urgent care card -->
    //   <CareCard type="non-urgent" heading="Speak to a GP if:">
    //     <ul><li>you have symptoms for more than 3 days</li></ul>
    //   </CareCard>
    //
    //   <!-- Immediate care card -->
    //   <CareCard type="immediate" heading="Call 999 if:">
    //     <ul><li>you have difficulty breathing</li></ul>
    //   </CareCard>
    //
    // Keyboard:
    //   None — this component is a passive content container.
    //
    // Accessibility:
    //   - role="region" identifies the card as a named landmark
    //   - aria-label set from label prop or heading prop for screen reader identification
    //   - <h2> heading provides document structure
    //   - data-type exposes urgency level for consumer styling hooks
    //
    // Internationalization:
    //   - All text comes through heading, label, and children props; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer uses data-type attribute to apply urgency-appropriate visual styles
    //
    // References:
    //   - NHS England Care Cards: https://service-manual.nhs.uk/design-system/components/care-cards

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        type = "non-urgent",
        heading,
        label = undefined,
        children,
        ...restProps
    }: {
        type?: "non-urgent" | "urgent" | "immediate";
        heading: string;
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CareCard.svelte -->
<section
    class={`care-card ${className}`}
    role="region"
    aria-label={label ?? heading}
    data-type={type}
    {...restProps}
>
    <h2>{heading}</h2>
    {@render children?.()}
</section>
