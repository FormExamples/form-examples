<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.pain;

	const painBand = $derived(
		p.painScore === null
			? { label: 'Not recorded', color: 'bg-base-300 text-base-content border-base-300' }
			: p.painScore >= 7
				? { label: 'Severe (Very urgent — Level 2)', color: 'bg-error text-error-content border-error' }
				: p.painScore >= 4
					? { label: 'Moderate (Urgent — Level 3)', color: 'bg-warning text-warning-content border-warning' }
					: { label: 'Mild', color: 'bg-success text-success-content border-success' }
	);
</script>

<Fieldset legend="Step 6 of 8 — Pain score">
	<p class="hint">
		Numeric pain rating 0-10. Severe pain (&ge; 7) is Very urgent; moderate pain (4-6) is Urgent.
	</p>

	<Field label="Pain score (0-10)" inputId="pain-painScore">
		<NumberInput id="pain-painScore" label="Pain score" min={0} max={10} step={1} bind:value={p.painScore} />
	</Field>

	<Field label="Pain discriminator">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {painBand.color}">
			{painBand.label}
		</span>
	</Field>
</Fieldset>
