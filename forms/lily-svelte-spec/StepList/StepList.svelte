<script lang="ts">
    // StepList component
    //
    // An ordered list of step items showing progress through a multi-step
    // process. Renders a semantic <ol> with optional aria-label and
    // data-current for the active step.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, optional. aria-label.
    //   current — number, optional. 0-based index of the current step (data hook).
    //   children — Snippet, required. StepListItem children.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
    //
    // Syntax:
    //   <StepList label="Checkout" current={1}>
    //     <StepListItem status="finished">Cart</StepListItem>
    //     <StepListItem status="in-progress" current>Shipping</StepListItem>
    //     <StepListItem status="waiting">Payment</StepListItem>
    //   </StepList>
    //
    // Accessibility:
    //   - <ol> provides list semantics.
    //   - aria-label is optional; consumers may also use aria-labelledby.
    //
    // Internationalization:
    //   - label comes through props.
    //
    // Claude rules:
    //   - Headless: no styles.
    //
    // References:
    //   - Ant Design Steps: https://ant.design/components/steps

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        current = undefined,
        children,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Accessible label */
        label?: string;
        /** 0-based index of the current step */
        current?: number;
        /** StepListItem children */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StepList.svelte -->
<ol
    class={`step-list ${className}`}
    aria-label={label}
    data-current={current}
    {...restProps}
>
    {@render children?.()}
</ol>
