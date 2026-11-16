<script lang="ts">
    // TourList component
    //
    // A headless ordered list of guided walkthrough steps that presents step-by-step
    // instructions to users. It is a plain <ol> (no role="dialog", no aria-modal), so
    // screen readers keep its list semantics and announce the step count; any dialog
    // semantics belong to the enclosing Tour, which is non-modal. Useful for onboarding flows, feature tutorials, or
    // contextual help systems. The consumer provides TourListItem children to
    // define each step of the tour.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tour dialog via aria-label.
    //   active — boolean, default false. Whether the tour is visible; bindable with bind:active.
    //   children — Snippet, required. TourListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
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
    //   - native <ol> list semantics (no role="dialog": it would hide the list; no aria-modal: not modal)
    //   - aria-label={label} provides an accessible name for the list of steps
    //   - tabindex="-1" allows the list to receive focus for keyboard events
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
        /** Whether the tour is visible. Bindable. */
        active?: boolean;
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
        aria-label={label}
        tabindex="-1"
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </ol>
{/if}
