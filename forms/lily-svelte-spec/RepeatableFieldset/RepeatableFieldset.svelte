<script
    lang="ts"
    generics="T"
>
    // RepeatableFieldset component
    //
    // The "add another" pattern (tasks.md P29-T10, spec/lessons/openehr item 13): a <fieldset> whose legend names the
    // whole question, holding one <fieldset> per item, each with its own legend and a remove button, and an add button
    // after them. The items are the consumer's data; the component adds (with newItem), removes, numbers the legends with
    // the consumer's words, and moves focus: to the new item's first field on add, to the add button on remove. min and
    // max limit the count. Every word is the consumer's: legends and remove labels come from functions of the item's
    // number, so no English is built.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   legend — string, required. Names the whole group ("Medicines").
    //   items — T[], bindable, default []. The consumer's items.
    //   newItem — () => T, required. Makes a new item when the add button is pressed.
    //   itemLegend — (number: number) => string, required. Each item's legend ("Medicine 2"); numbers start at 1.
    //   addLabel — string, required. The add button's text ("Add another medicine").
    //   removeLabel — (number: number) => string, required. Each remove button's accessible text ("Remove medicine 2").
    //   min — number, default 0. The fewest items; remove buttons are left out at the minimum.
    //   max — number, optional. The most items; the add button is disabled at the maximum.
    //   addedLabel, removedLabel — (number: number) => string, optional. Announced politely after an add or a remove.
    //   item — Snippet<[T, number]>, required. One item's fields, given the item and its index.
    //   onAdd, onRemove — (index: number) => void, optional.
    //   ...restProps — additional HTML attributes spread onto the outer <fieldset>.
    //
    // Keyboard:
    //   - Tab moves through each item's fields, its remove button, then the add button; each button is native
    //
    // Accessibility:
    //   - The outer legend names the group; each item's legend names it, announced with its fields
    //   - Focus is never lost: after add it goes to the new item's first field, after remove to the add button
    //   - An optional polite status announces the change in the consumer's words
    //
    // References:
    //   - GOV.UK Design System, add another (MOJ pattern): https://design-patterns.service.justice.gov.uk/components/add-another/
    import { tick, type Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        legend,
        items = $bindable([]),
        newItem,
        itemLegend,
        addLabel,
        removeLabel,
        min = 0,
        max = undefined,
        addedLabel = undefined,
        removedLabel = undefined,
        item,
        onAdd = undefined,
        onRemove = undefined,
        ...restProps
    }: {
        legend: string;
        items?: T[];
        newItem: () => T;
        itemLegend: (number: number) => string;
        addLabel: string;
        removeLabel: (number: number) => string;
        min?: number;
        max?: number;
        addedLabel?: (number: number) => string;
        removedLabel?: (number: number) => string;
        item: Snippet<[T, number]>;
        onAdd?: (index: number) => void;
        onRemove?: (index: number) => void;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        warnMissingProp("RepeatableFieldset", "legend", legend, "the group needs a name.");
        warnMissingProp("RepeatableFieldset", "addLabel", addLabel, "the add button needs words.");
    });

    let root: HTMLFieldSetElement | undefined = $state();
    let addButton: HTMLButtonElement | undefined = $state();
    let status = $state("");

    const canAdd = $derived(max === undefined || items.length < max);
    const canRemove = $derived(items.length > min);

    async function add() {
        if (!canAdd) return;
        items = [...items, newItem()];
        const index = items.length - 1;
        status = addedLabel?.(index + 1) ?? "";
        onAdd?.(index);
        await tick();
        const fieldsets = root?.querySelectorAll<HTMLFieldSetElement>(
            ":scope > .repeatable-fieldset-item",
        );
        const first = fieldsets?.[index]?.querySelector<HTMLElement>(
            "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
        );
        first?.focus();
    }

    async function remove(index: number) {
        if (!canRemove) return;
        items = items.filter((_, i) => i !== index);
        status = removedLabel?.(index + 1) ?? "";
        onRemove?.(index);
        await tick();
        addButton?.focus();
    }
</script>

<!-- RepeatableFieldset.svelte -->
<fieldset
    bind:this={root}
    class={`repeatable-fieldset ${className}`}
    data-count={items.length}
    {...restProps}
>
    <legend>{legend}</legend>
    {#each items as entry, index (entry)}
        <fieldset
            class="repeatable-fieldset-item"
            data-index={index}
        >
            <legend class="repeatable-fieldset-item-legend">{itemLegend(index + 1)}</legend>
            {@render item(entry, index)}
            {#if canRemove}
                <button
                    type="button"
                    class="repeatable-fieldset-remove"
                    onclick={() => remove(index)}>{removeLabel(index + 1)}</button
                >
            {/if}
        </fieldset>
    {/each}
    <button
        bind:this={addButton}
        type="button"
        class="repeatable-fieldset-add"
        disabled={!canAdd}
        onclick={add}>{addLabel}</button
    >
    {#if addedLabel || removedLabel}
        <p
            class="repeatable-fieldset-status"
            role="status"
        >
            {status}
        </p>
    {/if}
</fieldset>
