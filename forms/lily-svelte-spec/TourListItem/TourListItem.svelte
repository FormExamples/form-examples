<script lang="ts">
    // TourListItem component
    //
    // A single step within a TourList guided tour. Each step represents one
    // screen or instruction in the tour sequence. The step conditionally shows
    // or hides based on the current prop, using the hidden attribute and
    // aria-hidden for proper accessibility. The step's name is the consumer's: with stepTemplate and both
    // numbers, the template replaces the label, with {label}, {step} and {total} filled in. No English default.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for this step via aria-label.
    //   current — boolean, default false. Whether this step is the currently visible step.
    //   stepNumber — number, optional. 1-based step number (e.g. 1, 2, 3).
    //   totalSteps — number, optional. Total number of steps in the tour.
    //   stepTemplate — string, optional. The step's whole name, e.g. "{label} (Step {step} of {total})".
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
    //   - The <li> stays a list item of its tour list (tasks.md P25-T7): a group role would take it out of the list
    //   - aria-label is label, or stepTemplate filled in when given with both numbers
    //   - data-current indicates the currently active step
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
    //   - WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        current = false,
        stepNumber,
        totalSteps,
        stepTemplate = "",
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
        /** With both numbers, replaces `label`: {label}, {step} and {total} are filled in. */
        stepTemplate?: string;
        /** Step content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // Build the full accessible label including step progress when available
    let fullLabel = $derived(
        stepTemplate && stepNumber != null && totalSteps != null
            ? stepTemplate
                  .replace("{label}", label)
                  .replace("{step}", String(stepNumber))
                  .replace("{total}", String(totalSteps))
            : label,
    );
</script>

<!-- TourListItem.svelte -->
<li
    class={`tour-list-item ${className}`}
    aria-label={fullLabel}
    data-current={current ? "" : undefined}
    aria-hidden={!current ? "true" : undefined}
    hidden={!current ? true : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
