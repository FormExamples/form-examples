<script lang="ts">
    // StepListItem component
    //
    // One step in a step list with a status of waiting, in-progress, finished,
    // or error. Renders a semantic <li> with data-status and aria-current
    // when active.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   status — "waiting" | "in-progress" | "finished" | "error",
    //            default "waiting". Renders as data-status.
    //   current — boolean, default false. When true, renders aria-current="step".
    //   label — string, optional. aria-label override.
    //   children — Snippet, required. Step content (typically title and description).
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <StepListItem status="finished">Cart</StepListItem>
    //
    // Accessibility:
    //   - aria-current="step" when current=true.
    //   - aria-label optional override.
    //
    // Internationalization:
    //   - All text via children and label prop.
    //
    // Claude rules:
    //   - Headless: no styles.
    //
    // References:
    //   - Ant Design Steps: https://ant.design/components/steps

    import type { Snippet } from "svelte";

    type Status = "waiting" | "in-progress" | "finished" | "error";

    let {
        class: className = "",
        status = "waiting",
        current = false,
        label = undefined,
        children,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Step status */
        status?: Status;
        /** Whether this is the current step */
        current?: boolean;
        /** Accessible label override */
        label?: string;
        /** Step content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StepListItem.svelte -->
<li
    class={`step-list-item ${className}`}
    data-status={status}
    aria-current={current ? "step" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</li>
