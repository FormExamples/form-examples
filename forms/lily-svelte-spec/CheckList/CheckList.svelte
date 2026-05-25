<script lang="ts">
    // CheckList component
    //
    // A headless semantic list container for CheckList items. Renders a <ul> with
    // role="list" for tracking and managing tasks, options, or steps. Consumers
    // provide <li> children with checkboxes or other interactive controls. Commonly
    // used in to-do lists, onboarding flows, forms, and progress tracking interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name for the CheckList via aria-label.
    //   children — Snippet, required. List items to render inside the <ul>.
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <CheckList label="Tasks">
    //     <CheckListItem>Task one</CheckListItem>
    //   </CheckList>
    //
    // Examples:
    //   <!-- Onboarding CheckList -->
    //   <CheckList label="Onboarding tasks">
    //     <CheckListItem checked>Create account</CheckListItem>
    //     <CheckListItem>Set up profile</CheckListItem>
    //     <CheckListItem>Invite team members</CheckListItem>
    //   </CheckList>
    //
    // Keyboard:
    //   None — this is a passive container. Keyboard interactions are determined
    //   by the consumer-provided child elements (e.g., checkboxes respond to Space).
    //
    // Accessibility:
    //   - role="list" ensures assistive technologies treat it as a list
    //   - aria-label provides an optional accessible name for the CheckList
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //   - Item content is provided by the consumer
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: parent container for CheckListItem children
    //
    // References:
    //   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CheckList.svelte -->
<ol
    class={`check-list ${className}`}
    role="list"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ol>
