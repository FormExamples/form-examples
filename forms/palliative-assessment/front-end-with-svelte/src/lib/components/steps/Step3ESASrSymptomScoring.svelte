<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { ESAS_ITEMS, classifyESASTotal, severityBandLabel } from '#lib/engine/utils.js';
	import type { ESASSymptomKey } from '#lib/engine/types.js';

	const s = assessment.data.esasrSymptoms;

	const liveTotal = $derived(
		ESAS_ITEMS.reduce((sum, item) => {
			const v = s[item.key as ESASSymptomKey];
			return sum + (typeof v === 'number' ? v : 0);
		}, 0)
	);
	const band = $derived(classifyESASTotal(liveTotal));
</script>

<Fieldset legend="ESAS-r Symptom Scoring">
	<p class="hint">
		Rate each symptom over the last 24 hours from 0 (none) to 10 (worst possible). Leave a symptom
		blank if it was not assessed; blank items are excluded from the total.
	</p>

	{#each ESAS_ITEMS as item (item.key)}
		<Field label={item.label} description={`0 = ${item.lowPole} · 10 = ${item.highPole}`} inputId={`esas-${item.key}`}>
			<NumberInput
				id={`esas-${item.key}`}
				label={item.label}
				min={0}
				max={10}
				step={1}
				bind:value={s[item.key as ESASSymptomKey]}
			/>
		</Field>
	{/each}

	<Field label="Other symptom label" description="Name the 'Other' symptom, e.g. constipation, sleep, itch" inputId="otherLabel">
		<TextInput id="otherLabel" label="Other symptom label" bind:value={s.otherLabel} />
	</Field>

	<Field label="Symptom notes" inputId="symptomNotes">
		<TextAreaInput id="symptomNotes" label="Symptom notes" rows={2} bind:value={s.symptomNotes} />
	</Field>

	<div class="esas-total">
		ESAS-r running total: <strong>{liveTotal}</strong> / 100
		<span class="esas-band">({severityBandLabel(band)})</span>
	</div>
</Fieldset>

<style>
	.esas-total {
		margin-top: 0.5rem;
		font-size: 0.95rem;
	}
	.esas-band {
		color: var(--color-muted);
	}
</style>
