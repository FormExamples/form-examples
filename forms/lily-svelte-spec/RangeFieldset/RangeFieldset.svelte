<script lang="ts">
    // RangeFieldset component
    //
    // A headless two-thumb range: a <fieldset> with a visible <legend> and two native
    // <input type="range">, one for the minimum and one for the maximum of a span of
    // values, such as a price band or an age range. Both inputs share one scale (min to
    // max), so the consumer's CSS can lay them over one track; the thumbs cannot cross,
    // because a thumb moved past the other stops where the other is. Each input is its
    // own form field, and a form reset puts both back. The WAI-ARIA multi-thumb slider
    // pattern, on native inputs (tasks.md P34-T1, spec/lessons/retool).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   legend — string, required. The visible name of the whole range.
    //   minimumLabel — string, required. Accessible name of the lower thumb.
    //   maximumLabel — string, required. Accessible name of the upper thumb.
    //   minimum — number, default min. The lower value; bindable.
    //   maximum — number, default max. The upper value; bindable.
    //   min — number, default 0. The lowest value either thumb can take.
    //   max — number, default 100. The highest value either thumb can take.
    //   step — number, default 1. The increment of both thumbs.
    //   minimumName — string, optional. Form field name of the lower value.
    //   maximumName — string, optional. Form field name of the upper value.
    //   disabled — boolean, default false. Disables both thumbs.
    //   onchange — (minimum: number, maximum: number) => void, optional. Called when either value changes.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <RangeFieldset legend="Price" minimumLabel="Lowest price" maximumLabel="Highest price" bind:minimum bind:maximum />
    //
    // Keyboard:
    //   - Tab: move from the lower thumb to the upper thumb
    //   - Left Arrow / Down Arrow, Right Arrow / Up Arrow: one step (native)
    //   - Home / End: the thumb's lowest or highest value; a thumb stops at the other thumb
    //   - Page Up / Page Down: a larger step (native)
    //
    // Accessibility:
    //   - <fieldset> and <legend> name the group; aria-label names each thumb
    //   - Native range inputs give the slider role and announce their values
    //
    // Internationalization:
    //   - legend, minimumLabel and maximumLabel carry all text; no hardcoded strings
    //
    // References:
    //   - WAI-ARIA Multi-Thumb Slider: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
    //   - MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

    import { warnMissingName, warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        legend,
        minimumLabel,
        maximumLabel,
        min = 0,
        max = 100,
        minimum = $bindable(min),
        maximum = $bindable(max),
        step = 1,
        minimumName = undefined,
        maximumName = undefined,
        disabled = false,
        onchange = undefined,
        ...restProps
    }: {
        /** Visible name of the whole range. */
        legend: string;
        /** Accessible name of the lower thumb. */
        minimumLabel: string;
        /** Accessible name of the upper thumb. */
        maximumLabel: string;
        /** Lowest value either thumb can take. */
        min?: number;
        /** Highest value either thumb can take. */
        max?: number;
        /** Lower value. Bindable. */
        minimum?: number;
        /** Upper value. Bindable. */
        maximum?: number;
        /** Increment of both thumbs. */
        step?: number;
        /** Form field name of the lower value. */
        minimumName?: string;
        /** Form field name of the upper value. */
        maximumName?: string;
        /** Disables both thumbs. */
        disabled?: boolean;
        /** Called when either value changes. */
        onchange?: (minimum: number, maximum: number) => void;
        [key: string]: unknown;
    } = $props();

    // The values a form reset returns to.
    // svelte-ignore state_referenced_locally
    const initialMinimum = minimum;
    // svelte-ignore state_referenced_locally
    const initialMaximum = maximum;

    let lower: HTMLInputElement | undefined = $state();
    let upper: HTMLInputElement | undefined = $state();

    $effect(() => {
        warnMissingProp(
            "RangeFieldset",
            "legend",
            legend,
            "The group of thumbs has no visible name.",
        );
        warnMissingName("RangeFieldset minimum", minimumLabel);
        warnMissingName("RangeFieldset maximum", maximumLabel);
    });

    function moveLower(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const value = Math.min(Number(input.value), maximum);
        input.value = String(value);
        if (value !== minimum) {
            minimum = value;
            onchange?.(minimum, maximum);
        }
    }

    function moveUpper(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const value = Math.max(Number(input.value), minimum);
        input.value = String(value);
        if (value !== maximum) {
            maximum = value;
            onchange?.(minimum, maximum);
        }
    }

    // A form reset puts both thumbs back to their first values. The state is set, not read back from the inputs: by the next
    // task the inputs show the state again, so reading them would keep the moved values.
    $effect(() => {
        const form = lower?.form;
        if (!form) return;
        const restore = () =>
            setTimeout(() => {
                minimum = initialMinimum;
                maximum = initialMaximum;
            });
        form.addEventListener("reset", restore);
        return () => form.removeEventListener("reset", restore);
    });
</script>

<!-- RangeFieldset.svelte -->
<fieldset
    class={`range-fieldset ${className}`}
    {disabled}
    {...restProps}
>
    <legend class="range-fieldset-legend">{legend}</legend>
    <input
        bind:this={lower}
        class="range-fieldset-minimum"
        type="range"
        aria-label={minimumLabel}
        name={minimumName}
        {min}
        {max}
        {step}
        value={minimum}
        defaultValue={initialMinimum}
        oninput={moveLower}
    />
    <input
        bind:this={upper}
        class="range-fieldset-maximum"
        type="range"
        aria-label={maximumLabel}
        name={maximumName}
        {min}
        {max}
        {step}
        value={maximum}
        defaultValue={initialMaximum}
        oninput={moveUpper}
    />
</fieldset>
