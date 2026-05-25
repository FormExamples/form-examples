<script lang="ts">
    // AccordionCheckbox component
    //
    // A compound disclosure widget that pairs a checkbox option with a
    // revealable panel. The user sees a checkbox option; checking the box
    // reveals an accordion panel of additional content beneath it. Multiple
    // AccordionCheckbox instances stacked vertically form a list of
    // independent toggleable options.
    //
    // Unlike Details, which uses a <summary> toggle, this component uses a
    // real form control. The `checked` prop is the source of truth.
    //
    // Props:
    //   class — string, optional. CSS class name appended to .accordion-checkbox.
    //   label — string, required. Checkbox label text.
    //   checked — boolean, default false. Whether the checkbox is checked
    //             and the panel is revealed; bindable.
    //   id — string, optional. Base id for the checkbox/panel link;
    //        auto-generated if not provided.
    //   children — Snippet, required. Content shown when checked.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <AccordionCheckbox label="Show options">…</AccordionCheckbox>
    //
    // Examples:
    //   <!-- Basic disclosure -->
    //   <AccordionCheckbox label="I have a follow-up question">
    //     <textarea aria-label="Your question"></textarea>
    //   </AccordionCheckbox>
    //
    //   <!-- Two-way binding with parent state -->
    //   <AccordionCheckbox label="Subscribe to updates" bind:checked={subscribe}>
    //     <p>Choose your topics below.</p>
    //   </AccordionCheckbox>
    //
    // Keyboard:
    //   - Tab: moves focus onto the checkbox
    //   - Space: toggles the checkbox (native), revealing or hiding the panel
    //
    // Accessibility:
    //   - aria-controls on the checkbox references the panel id
    //   - aria-expanded on the checkbox reflects the checked state
    //   - role="region" + aria-labelledby on the panel
    //   - hidden attribute on the panel when unchecked
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on checked for two-way state synchronization
    //   - Auto-generates a unique id so multiple instances do not collide
    //
    // References:
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
    //   - MDN input type=checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
    //   - MDN aria-controls: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        checked = $bindable(false),
        id,
        children,
        ...restProps
    }: {
        /** Checkbox label text. */
        label: string;
        /** Whether the checkbox is checked. Bindable. */
        checked?: boolean;
        /** Base id for the checkbox/panel link. */
        id?: string;
        /** Content shown when checked. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const generatedId = `accordion-checkbox-${Math.random().toString(36).slice(2, 9)}`;
    const baseId = $derived(id ?? generatedId);
    const checkboxId = $derived(`${baseId}-checkbox`);
    const panelId = $derived(`${baseId}-panel`);
</script>

<!-- AccordionCheckbox.svelte -->
<div
    class={`accordion-checkbox ${className}`}
    {...restProps}
>
    <input
        type="checkbox"
        class="accordion-checkbox-input"
        id={checkboxId}
        aria-controls={panelId}
        aria-expanded={checked}
        bind:checked
    />
    <label
        class="accordion-checkbox-label"
        for={checkboxId}
    >
        {label}
    </label>
    <div
        class="accordion-checkbox-panel"
        id={panelId}
        role="region"
        aria-labelledby={checkboxId}
        hidden={!checked}
    >
        {@render children?.()}
    </div>
</div>
