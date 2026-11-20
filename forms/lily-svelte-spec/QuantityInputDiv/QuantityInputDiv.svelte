<script lang="ts">
    // QuantityInputDiv component
    //
    // A quantity entered as a number and a unit (tasks.md P29-T8, spec/lessons/openehr item 12): a group holding a
    // labelled number input and, when there is more than one unit, a labelled unit <select>; with one unit the unit is
    // text, linked to the number by aria-describedby. Each unit carries its own min, max and step, and the number input
    // takes the limits of the unit chosen, so "0 to 300 kg" and "0 to 660 lb" are both enforced by the browser's own
    // validation. Nothing is converted: changing the unit keeps the number as typed.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The group's name ("Weight").
    //   magnitudeLabel — string, required. The number input's label ("Amount").
    //   unitLabel — string, required when there is more than one unit. The unit select's label ("Unit").
    //   units — { value, label, min?, max?, step? }[], required. The units offered, in the consumer's words; the first is
    //     the default.
    //   magnitude — string, default "". The number as typed; bindable.
    //   unit — string, default the first unit's value. The unit chosen; bindable.
    //   name — string, optional. Base name: the fields are {name}-magnitude and {name}-unit.
    //   required, disabled — boolean, default false.
    //   id — string, optional. Base id: the fields are {id}-magnitude and {id}-unit.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Keyboard:
    //   - Tab moves between the number and the unit; each is a native control
    //
    // Accessibility:
    //   - role="group" with aria-label names the pair; each control has a visible <label for>
    //   - A single unit is text linked by aria-describedby, so it is read with the number
    //
    // References:
    //   - openEHR DV_QUANTITY: https://specifications.openehr.org/releases/RM/latest/data_types.html
    //   - WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/
    import { onMount } from "svelte";
    import { warnMissingName, warnMissingProp } from "../dev-warning";

    type Unit = { value: string; label: string; min?: number; max?: number; step?: number | "any" };

    let {
        class: className = "",
        label,
        magnitudeLabel,
        unitLabel,
        units = [],
        magnitude = $bindable(""),
        unit = $bindable(units[0]?.value ?? ""),
        name = undefined,
        required = false,
        disabled = false,
        id = undefined,
        ...restProps
    }: {
        /** The group's name. */
        label: string;
        /** The number input's label. */
        magnitudeLabel: string;
        /** The unit select's label; required when there is more than one unit. */
        unitLabel?: string;
        /** The units offered, each with its own limits. */
        units: Unit[];
        /** The number as typed. Bindable. */
        magnitude?: string;
        /** The unit chosen. Bindable. */
        unit?: string;
        /** Base name: {name}-magnitude and {name}-unit. */
        name?: string;
        required?: boolean;
        disabled?: boolean;
        /** Base id; auto-generated if omitted. */
        id?: string;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        warnMissingName(
            "QuantityInputDiv",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        );
        warnMissingProp(
            "QuantityInputDiv",
            "magnitudeLabel",
            magnitudeLabel,
            "the number needs a label.",
        );
        if (units.length > 1)
            warnMissingProp(
                "QuantityInputDiv",
                "unitLabel",
                unitLabel,
                "the unit choice needs a label.",
            );
    });

    const uid = $props.id();
    const baseId = $derived(id ?? `quantity-input-div-${uid}`);
    const chosen = $derived(units.find((u) => u.value === unit) ?? units[0]);

    // A form reset puts the native controls back; put the bound values back with them.
    let root: HTMLDivElement | undefined = $state();
    onMount(() => {
        const form = root?.closest("form");
        if (!form) return;
        const initial = { magnitude, unit };
        const onReset = () =>
            setTimeout(() => {
                magnitude = initial.magnitude;
                unit = initial.unit;
            }, 0);
        form.addEventListener("reset", onReset);
        return () => form.removeEventListener("reset", onReset);
    });
</script>

<!-- QuantityInputDiv.svelte -->
<div
    bind:this={root}
    class={`quantity-input-div ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    <label for={`${baseId}-magnitude`}>{magnitudeLabel}</label>
    <input
        class="quantity-input-div-magnitude"
        id={`${baseId}-magnitude`}
        name={name ? `${name}-magnitude` : undefined}
        type="number"
        inputmode="decimal"
        min={chosen?.min}
        max={chosen?.max}
        step={chosen?.step}
        bind:value={magnitude}
        aria-describedby={units.length === 1 ? `${baseId}-unit` : undefined}
        {required}
        {disabled}
    />
    {#if units.length > 1}
        <label for={`${baseId}-unit`}>{unitLabel}</label>
        <select
            class="quantity-input-div-unit"
            id={`${baseId}-unit`}
            name={name ? `${name}-unit` : undefined}
            bind:value={unit}
            {required}
            {disabled}
        >
            {#each units as option (option.value)}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    {:else if units.length === 1}
        <span
            class="quantity-input-div-unit"
            id={`${baseId}-unit`}>{units[0].label}</span
        >
        {#if name}<input
                type="hidden"
                name={`${name}-unit`}
                value={units[0].value}
            />{/if}
    {/if}
</div>
