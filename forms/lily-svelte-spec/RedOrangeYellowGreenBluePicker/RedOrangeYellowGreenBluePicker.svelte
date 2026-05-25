<script lang="ts">
    // RedOrangeYellowGreenBluePicker component
    //
    // A headless ROYGB (Red/Orange/Yellow/Green/Blue) status input that renders
    // a native <select> element with five color-coded status options. Extends the
    // traditional RAG model with additional orange and blue levels for more granular
    // status reporting in risk registers, dashboards, and multi-tier alert systems.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the select element.
    //   value — string, default "". Currently selected status value; bindable.
    //   ...restProps — additional HTML attributes spread onto the <select>.
    //
    // Syntax:
    //   <RedOrangeYellowGreenBluePicker label="Risk level" bind:value={level} />
    //
    // Examples:
    //   <!-- Pre-selected value -->
    //   <RedOrangeYellowGreenBluePicker label="Alert status" value="green" />
    //
    //   <!-- Two-way binding with extra attributes -->
    //   <RedOrangeYellowGreenBluePicker label="Project health" bind:value={level} data-dashboard="main" />
    //
    // Keyboard:
    //   - Arrow Up/Down: navigate options (native select behavior)
    //   - Enter/Space: open the dropdown (native select behavior)
    //   - Escape: close the dropdown (native select behavior)
    //
    // Accessibility:
    //   - aria-label on the <select> for screen reader context
    //   - Native <select> provides implicit combobox/listbox role
    //   - WCAG 2.2 AAA: properly labeled for assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //   - Option display text ("Red", "Orange", etc.) is hardcoded; wrap or fork to localize
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value uses $bindable() for two-way binding with bind:value
    //   - Options are fixed to five values: red, orange, yellow, green, blue
    //
    // References:
    //   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

    let {
        class: className = "",
        label,
        value = $bindable(""),
        ...restProps
    }: {
        /** Accessible label for the select element */
        label: string;
        /** Currently selected ROYGB status value, bindable */
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RedOrangeYellowGreenBluePicker: a select with Red/Orange/Yellow/Green/Blue status options -->
<select
    class={`red-orange-yellow-green-blue-picker ${className}`}
    aria-label={label}
    bind:value
    {...restProps}
>
    <option value="red">Red</option>
    <option value="orange">Orange</option>
    <option value="yellow">Yellow</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
</select>
