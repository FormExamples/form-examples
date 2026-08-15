<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { bloodUreaPoints, haemoglobinPoints } from '#lib/engine/gbs-rules.js';
	import { formatPoint } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const labs = assessment.data.labs;
	const ureaPoint = $derived(bloodUreaPoints(assessment.data));
	const hbPoint = $derived(haemoglobinPoints(assessment.data));
</script>

<Fieldset legend="Step 3 of 6 — Laboratory markers">
	<p class="hint">
		Parameters 1 and 2/3 — blood urea and haemoglobin from the first-assessment bloods.
	</p>

	<Field
		label="Blood urea (mmol/L)"
		description="0 points &lt; 6.5, 2 points 6.5-7.9, 3 points 8.0-9.9, 4 points 10.0-24.9, 6 points &ge; 25.0 mmol/L."
		inputId="labs-bloodUrea"
	>
		<NumberInput
			id="labs-bloodUrea"
			label="Blood urea"
			min={0}
			max={100}
			step={0.1}
			bind:value={labs.bloodUrea}
		/>
	</Field>

	<Field label="Blood urea points">
		<strong class="text-lg text-base-content">{formatPoint(ureaPoint)}</strong>
	</Field>

	<Field
		label="Haemoglobin (g/L)"
		description="Sex-specific. Men: 0 pts &ge; 130, 1 pt 120-129, 3 pts 100-119, 6 pts &lt; 100. Women: 0 pts &ge; 120, 1 pt 100-119, 6 pts &lt; 100."
		inputId="labs-haemoglobin"
	>
		<NumberInput
			id="labs-haemoglobin"
			label="Haemoglobin"
			min={0}
			max={250}
			step={1}
			bind:value={labs.haemoglobin}
		/>
	</Field>

	<Field label="Haemoglobin points">
		<strong class="text-lg text-base-content">{formatPoint(hbPoint)}</strong>
	</Field>
</Fieldset>
