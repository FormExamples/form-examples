<script lang="ts">
    // NumericRatingScalePicker component
    //
    // A headless 0 to 10 rating, such as a numeric pain rating scale (spec/healthcare-ui item 12, P27-T12): a <fieldset>
    // whose <legend> names the question, one radio per whole number from min to max, and the consumer's words for each end
    // ("No pain", "Worst pain imaginable"), linked to the end radios with aria-describedby. Lily ships no anchor words and
    // no scale: a validated instrument's wording is the consumer's, and Lily is not one.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The question, rendered as the <legend>.
    //   min — number, default 0. The lowest value.
    //   max — number, default 10. The highest value.
    //   minLabel — string, optional. The words for the lowest value; shown and linked to its radio.
    //   maxLabel — string, optional. The words for the highest value; shown and linked to its radio.
    //   value — string, bindable, default "". The chosen value.
    //   name — string, default "rating". The radios' form name.
    //   required — boolean, default false. Marks the first radio required, so the form needs an answer.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Keyboard:
    //   - Tab moves into the group, to the chosen radio or the first; the arrow keys move and choose (native radios).
    //
    // Accessibility:
    //   - Native radios in a fieldset named by its legend; each radio is named by its number, and the end radios are
    //     described by the anchor words.
    import { untrack } from "svelte";
    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        min = 0,
        max = 10,
        minLabel,
        maxLabel,
        value = $bindable(""),
        name = "rating",
        required = false,
        ...restProps
    }: {
        label: string;
        min?: number;
        max?: number;
        minLabel?: string;
        maxLabel?: string;
        value?: string;
        name?: string;
        required?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() => warnMissingName("NumericRatingScalePicker", label, restProps["aria-labelledby"]));

    const id = $props.id();
    const steps = $derived(Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i));

    // Form reset restores the first value, as the other pickers do.
    let root: HTMLFieldSetElement | undefined = $state();
    const initialValue = untrack(() => value);
    $effect(() => {
        const form = root?.form ?? root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                value = initialValue;
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });
</script>

<!-- NumericRatingScalePicker.svelte -->
<fieldset
    bind:this={root}
    class={`numeric-rating-scale-picker ${className}`}
    {...restProps}
>
    <legend class="numeric-rating-scale-picker-legend">{label}</legend>
    {#if minLabel}<span
            class="numeric-rating-scale-picker-min-label"
            id={`${id}-min`}>{minLabel}</span
        >{/if}
    <span class="numeric-rating-scale-picker-options">
        {#each steps as step, i (step)}
            <label class="numeric-rating-scale-picker-option">
                <input
                    type="radio"
                    {name}
                    value={String(step)}
                    checked={value === String(step)}
                    required={required && i === 0}
                    aria-describedby={i === 0 && minLabel
                        ? `${id}-min`
                        : i === steps.length - 1 && maxLabel
                          ? `${id}-max`
                          : undefined}
                    onchange={() => (value = String(step))}
                />
                {step}
            </label>
        {/each}
    </span>
    {#if maxLabel}<span
            class="numeric-rating-scale-picker-max-label"
            id={`${id}-max`}>{maxLabel}</span
        >{/if}
</fieldset>
