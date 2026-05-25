<script lang="ts">
    // TourList component
    //
    // A headless guided walkthrough overlay that presents step-by-step
    // instructions to users. Useful for onboarding flows, feature tutorials, or
    // contextual help systems. The consumer provides TourListItem children to
    // define each step of the tour.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tour dialog via aria-label.
    //   active — boolean, default false. Whether the tour is visible; bindable with bind:active.
    //   children — Snippet, required. TourListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <TourList label="Getting started" bind:active>...</TourList>
    //
    // Examples:
    //   <!-- Multi-step tour -->
    //   <TourList label="Getting started" bind:active>
    //     <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
    //       <p>Welcome to the app!</p>
    //       <button onclick={() => step++}>Next</button>
    //     </TourListItem>
    //     <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
    //       <p>Here are the features.</p>
    //       <button onclick={() => step--}>Back</button>
    //       <button onclick={() => step++}>Next</button>
    //     </TourListItem>
    //   </TourList>
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
    //   - All step content comes through TourListItem children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: pair with TourListItem for each step
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
        /** Accessible label for the tour. */
        label: string;
        /** TourListItem elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            active = false;
        }
    }
</script>

<!-- TourList.svelte -->
{#if active}
    <ol
        class={`tour-list ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabindex="-1"
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </ol>
{/if}
