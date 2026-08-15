<script lang="ts">
	// One ZBI item rendered as a radio group of five 0..4 frequency options.
	//
	// The store holds the RAW 0..4 rating; there is NO reverse-scoring. The live
	// rating pill shows the raw 0..4 value. When the ZBI-12 short form is
	// selected, items outside the short-form subset are marked as not scored.
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { RESPONSE_SCALE, ratingValue, normalizeInstrumentForm } from '#lib/engine/zarit-rules.js';
	import { itemRatingColor } from '#lib/engine/utils.js';
	import type { ZaritItem } from '#lib/engine/types.js';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	let { item }: { item: ZaritItem } = $props();

	const items = assessment.data.items;
	const groupId = $derived(`items-${item.field}`);
	const raw = $derived(ratingValue(items[item.field]));
	const instrumentForm = $derived(normalizeInstrumentForm(assessment.data));
	const scored = $derived(instrumentForm === 'zbi22' || item.shortForm);
</script>

<fieldset class="field radio-fieldset" id={`${groupId}-fieldset`}>
	<legend class="label">
		<span class="text-sm font-semibold text-primary">
			Item {item.number}{item.global ? ' (global burden)' : ''}
			{#if !scored}
				<span class="text-base-content/60">— not scored on ZBI-12</span>
			{/if}
		</span>
		<span class="block font-medium text-base-content">{item.statement}</span>
	</legend>

	<RadioGroup label={item.statement} aria-labelledby={`${groupId}-fieldset`}>
		{#each RESPONSE_SCALE as option (option.value)}
			<label class="flex items-center gap-2">
				<input
					type="radio"
					class="radio-input"
					name={groupId}
					id={option.value === 0 ? groupId : undefined}
					value={option.value}
					bind:group={items[item.field]}
				/>
				{option.value} — {option.label}
			</label>
		{/each}
	</RadioGroup>

	<p class="hint">
		Rating:
		{#if raw === null}
			<span class="text-base-content/60">not yet answered</span>
		{:else}
			<span
				class="ml-1 inline-block rounded-full border px-2 py-0.5 text-xs font-bold {itemRatingColor(
					raw
				)}">{raw} of 4</span
			>
		{/if}
	</p>
</fieldset>
