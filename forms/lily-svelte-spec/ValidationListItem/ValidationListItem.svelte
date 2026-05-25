<script lang="ts">
    // ValidationListItem component
    //
    // A headless `<li>` that represents one validation rule in a
    // `ValidationList`. The status is exposed via the `data-status` attribute
    // (`pending`, `passed`, or `failed`) so consumers can style each state.
    // The textual rule comes from `children`; an optional `aria-label` may
    // override the accessible name.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   status — "pending" | "passed" | "failed", default "pending".
    //   label — string, optional. aria-label override.
    //   children — Snippet, required. Rule text.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
    //
    // Accessibility:
    //   - data-status conveys state for consumer styling
    //   - Rule text is the accessible content; aria-label may override
    //
    // Internationalization:
    //   - Rule text is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //   - children is REQUIRED

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        status = "pending",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Validation status */
        status?: "pending" | "passed" | "failed";
        /** Optional aria-label override */
        label?: string;
        /** Rule text content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ValidationListItem.svelte -->
<li
    class={`validation-list-item ${className}`}
    data-status={status}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</li>
