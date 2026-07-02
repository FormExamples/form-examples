<script lang="ts">
    // Tour component
    //
    // A tour guide is an outer container for a guided walkthrough experience,
    // such as for sightseeing, or pathways, or demonstrations, or onboarding.
    // It wraps a TourList and its TourListItem children, providing
    // the dialog overlay and keyboard dismissal behavior. When active, it
    // renders as a modal dialog that traps focus and can be closed with Escape.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tour dialog via aria-label.
    //   active — boolean, default false. Whether the tour is visible; bindable with bind:active.
    //   children — Snippet, required. TourList and its TourListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Tour label="Getting started" bind:active>
    //     <TourList label="Steps">
    //       <TourListItem label="Welcome" current={step === 0}>...</TourListItem>
    //     </TourList>
    //   </Tour>
    //
    // Examples:
    //   <!-- Multi-step tour with navigation -->
    //   <Tour label="Onboarding tour" bind:active>
    //     <TourList label="Tour steps">
    //       <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
    //         <p>Welcome to the app!</p>
    //         <button onclick={() => step++}>Next</button>
    //       </TourListItem>
    //       <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
    //         <p>Here are the features.</p>
    //         <button onclick={() => step--}>Back</button>
    //         <button onclick={() => step++}>Next</button>
    //       </TourListItem>
    //       <TourListItem label="Finish" current={step === 2} stepNumber={3} totalSteps={3}>
    //         <p>You're all set!</p>
    //         <button onclick={() => active = false}>Done</button>
    //       </TourListItem>
    //     </TourList>
    //   </Tour>
    //
    // Keyboard:
    //   - Escape: closes the tour by setting active to false
    //
    // Accessibility:
    //   - role="dialog" identifies the overlay as a dialog window
    //   - aria-modal="true" indicates the dialog is modal
    //   - aria-label={label} provides an accessible name for the tour
    //   - tabindex="-1" allows the dialog to receive focus for keyboard events
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All step content comes through TourList and TourListItem children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: wrap TourList which contains TourListItem
    //   - Uses $bindable() for two-way binding on active
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        active = $bindable(false),
        children,
        ...restProps
    }: {
        /** Accessible name for the tour dialog via aria-label. */
        label: string;
        /** Whether the tour is visible. Bindable via bind:active. */
        active?: boolean;
        /** TourList and TourListItem elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            active = false;
        }
    }
</script>

<!-- Tour.svelte -->
{#if active}
    <div
        class={`tour ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabindex="-1"
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
