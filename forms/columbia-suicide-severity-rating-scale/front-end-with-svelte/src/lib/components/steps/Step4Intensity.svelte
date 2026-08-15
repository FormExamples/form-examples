<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const t = assessment.data.intensity;
	const ctx = assessment.data.context;
	const isFull = $derived(ctx.scaleVersion === 'full');

	const items = [
		{ key: 'ideationFrequency' as const, id: 'intensity-ideationFrequency', label: 'Frequency of ideation' },
		{ key: 'ideationDuration' as const, id: 'intensity-ideationDuration', label: 'Duration of ideation' },
		{
			key: 'ideationControllability' as const,
			id: 'intensity-ideationControllability',
			label: 'Controllability of ideation'
		},
		{ key: 'ideationDeterrents' as const, id: 'intensity-ideationDeterrents', label: 'Deterrents' },
		{ key: 'ideationReasons' as const, id: 'intensity-ideationReasons', label: 'Reasons for ideation' }
	];
</script>

<Fieldset legend="Step 4 of 8 — Ideation intensity (optional)">
	<p class="hint">
		Optional ordinal sub-items (each 0-5) that characterise the most severe ideation on the full
		version. They inform clinical judgement but do not alter the ordinal ideation level.
	</p>

	{#if !isFull}
		<p class="hint">
			These sub-items are part of the full version. They can be left blank on the screener.
		</p>
	{/if}

	{#each items as item (item.key)}
		<Field label={item.label} description="Ordinal 0-5; leave blank if not assessed." inputId={item.id}>
			<NumberInput
				id={item.id}
				label={item.label}
				min={0}
				max={5}
				step={1}
				bind:value={t[item.key]}
			/>
		</Field>
	{/each}
</Fieldset>
