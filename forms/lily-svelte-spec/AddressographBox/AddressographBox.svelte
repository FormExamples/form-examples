<script lang="ts">
    // AddressographBox component
    //
    // A labelled box holding the identifying details of a patient or record (name, date of birth,
    // identifier, ward or location, salient notations), as on a hospital addressograph label. It supplies
    // the box only; the consumer supplies every field.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The identifying content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <AddressographBox label="…">…</AddressographBox>
    //
    // Examples:
    //   <AddressographBox label="Patient identification"><p>Name</p><p>Date of birth</p></AddressographBox>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given, naming the box for assistive technology
    //   - With a label the root is role="group", because a plain <div> cannot be named
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Show a national identifier with its `-view` component, not as bare text
    //
    // References:
    //   - MDN aria-label: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label

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

<!-- AddressographBox.svelte -->
<div
    class={`addressograph-box ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
