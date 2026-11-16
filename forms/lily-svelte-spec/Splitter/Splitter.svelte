<script lang="ts">
    // Splitter component
    //
    // A headless draggable separator between resizable panels that uses the ARIA
    // separator role with keyboard focus and value tracking. Renders a <div> with
    // orientation, value range, and accessible labeling. Used between adjacent panels
    // to provide a visual and interactive handle for resizing.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the splitter via aria-label.
    //   orientation — "horizontal" | "vertical", default "vertical". The split direction.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Splitter label="Resize panels" orientation="vertical" />
    //
    // Examples:
    //   <!-- Horizontal splitter between top and bottom panels -->
    //   <Splitter label="Resize editor and preview" orientation="horizontal" />
    //
    //   <!-- Vertical splitter with custom aria-valuenow -->
    //   <Splitter label="Resize sidebar" orientation="vertical" aria-valuenow={splitPos} />
    //
    // Keyboard:
    //   - Tab: moves focus to the splitter
    //   - Arrow keys: consumer should implement to adjust split position
    //   - Home: consumer should implement to set minimum position
    //   - End: consumer should implement to set maximum position
    //
    // Accessibility:
    //   - role="separator" identifies the element as a separator between regions
    //   - aria-label provides an accessible name describing the splitter's purpose
    //   - aria-orientation indicates horizontal or vertical direction
    //   - aria-valuenow/aria-valuemin/aria-valuemax report the split position
    //   - tabindex="0" makes the splitter keyboard-focusable
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Default value attributes (50/0/100); consumer updates dynamically
    //   - Consumer implements drag handlers and keyboard event handlers
    //   - No children — renders as an empty focusable div
    //
    // References:
    //   - WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
    //   - WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator

    import { warnMissingName } from "../dev-warning";
    import { attachSplitter } from "../widget-keys";

    let {
        class: className = "",
        label,
        orientation = "vertical",
        value = $bindable(50),
        min = 0,
        max = 100,
        onChange = undefined,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Orientation of the split. */
        orientation?: "horizontal" | "vertical";
        /** Position. Bindable. */
        value?: number;
        /** Smallest position. */
        min?: number;
        /** Largest position. */
        max?: number;
        /** Called with each new position. */
        onChange?: (value: number) => void;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Splitter", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let separator = $state<HTMLElement>();

    $effect(() =>
        separator
            ? attachSplitter(separator, {
                  onChange(next) {
                      value = next;
                      onChange?.(next);
                  },
              })
            : undefined,
    );
</script>

<!-- Splitter.svelte -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex (a focusable separator is the WAI-ARIA window splitter pattern) -->
<div
    bind:this={separator}
    class={`splitter ${className}`}
    role="separator"
    aria-label={label}
    aria-orientation={orientation}
    tabindex="0"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    {...restProps}
></div>
