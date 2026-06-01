<script lang="ts">
    // TourListItem component
    //
    // A single step within a TourList guided tour. Each step represents one
    // screen or instruction in the tour sequence. The step conditionally shows
    // or hides based on the current prop, using the hidden attribute and
    // aria-hidden for proper accessibility. When stepNumber and totalSteps are
    // provided, progress info ("Step N of M") is appended to the accessible label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for this step via aria-label.
    //   current — boolean, default false. Whether this step is the currently visible step.
    //   stepNumber — number, optional. 1-based step number (e.g. 1, 2, 3).
    //   totalSteps — number, optional. Total number of steps in the tour.
    //   children — Snippet, required. Step content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>...</TourListItem>
    //
    // Examples:
    //   <!-- Multi-step tour with navigation -->
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
    //   - None directly -- keyboard behavior comes from child interactive elements
    //
    // Accessibility:
    //   - role="group" groups the step content semantically
    //   - aria-roledescription="step" identifies the element as a tour step
    //   - aria-label includes step label and optional "Step N of M" progress
    //   - aria-current="step" indicates the currently active step
    //   - aria-hidden="true" and hidden attribute hide inactive steps
    //
    // Internationalization:
    //   - All user-facing text comes through props
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: must be used inside a TourList container
    //   - Uses $derived() for computed fullLabel with step progress
    //
    // References:
    //   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
    //   - WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
    //   - WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        current = false,
        stepNumber,
        totalSteps,
        children,
        ...restProps
    }: {
        /** Accessible label for this step. */
        label: string;
        /** Whether this step is the currently visible step. */
        current?: boolean;
        /** 1-based step number (e.g. 1, 2, 3). */
        stepNumber?: number;
        /** Total number of steps in the tour. */
        totalSteps?: number;
        /** Step content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // Build the full accessible label including step progress when available
    let fullLabel = $derived(
        stepNumber != null && totalSteps != null
            ? `${label} (Step ${stepNumber} of ${totalSteps})`
            : label,
    );
</script>

<!-- TourListItem.svelte -->
<li
    class={`tour-list-item ${className}`}
    role="group"
    aria-roledescription="step"
    aria-label={fullLabel}
    aria-current={current ? "step" : undefined}
    aria-hidden={!current ? "true" : undefined}
    hidden={!current ? true : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
