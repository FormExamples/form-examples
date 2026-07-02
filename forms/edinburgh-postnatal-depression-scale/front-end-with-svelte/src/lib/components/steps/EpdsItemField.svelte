<script lang="ts">
	// One EPDS item rendered as a radio group of four printed options.
	//
	// The store holds the RAW selected option index 0..3 (printed order); the
	// grader reverse-corrects items 3, 5, 6, 7, 8, 9 and 10. The live symptom
	// score pill shows the reverse-corrected 0..3 value.
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreForOption } from '$lib/engine/epds-rules';
	import { itemScoreColor } from '$lib/engine/utils';
	import type { EpdsItem } from '$lib/engine/types';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let { item }: { item: EpdsItem } = $props();

	const items = assessment.data.items;
	const groupId = $derived(`items-${item.field}`);
	const raw = $derived(items[item.field]);
	const score = $derived(scoreForOption(item.direction, raw));
</script>

<fieldset class="field radio-fieldset" id={`${groupId}-fieldset`}>
	<legend class="label">
		<span class="text-sm font-semibold text-primary"
			>Item {item.number}{item.direction === 'reverse' ? ' (reverse-scored)' : ''}</span
		>
		<span class="block font-medium text-base-content">{item.statement}</span>
	</legend>

	<RadioGroup label={item.statement} aria-labelledby={`${groupId}-fieldset`}>
		{#each item.options as option, index (index)}
			<label class="flex items-center gap-2">
				<input
					type="radio"
					class="radio-input"
					name={groupId}
					id={index === 0 ? groupId : undefined}
					value={index}
					bind:group={items[item.field]}
				/>
				{option}
			</label>
		{/each}
	</RadioGroup>

	<p class="hint">
		Symptom score:
		{#if score === null}
			<span class="text-base-content/60">not yet answered</span>
		{:else}
			<span
				class="ml-1 inline-block rounded-full border px-2 py-0.5 text-xs font-bold {itemScoreColor(
					score
				)}">{score} of 3</span
			>
		{/if}
	</p>
</fieldset>
