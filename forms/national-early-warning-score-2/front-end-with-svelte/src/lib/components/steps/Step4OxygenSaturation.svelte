<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { computeSubscores } from '#lib/engine/news2-grader.js';
	import { subscoreColor, spo2ScaleLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const o = assessment.data.oxygenSaturation;
	const points = $derived(computeSubscores(assessment.data).spo2);
	const scaleLabel = $derived(spo2ScaleLabel(assessment.data.context.spo2Scale) || 'Scale not selected');
</script>

<Fieldset legend="Step 4 of 10 — Oxygen saturation (SpO2)">
	<p class="hint">
		Parameter 2 — scored against the SpO2 scale selected in Step 1. Scale 2 additionally depends on
		air vs oxygen (Step 5).
	</p>

	<Field
		label="Measured oxygen saturation (%)"
		description={`Scoring against: ${scaleLabel}.`}
		inputId="oxygenSaturation-spo2"
	>
		<NumberInput
			id="oxygenSaturation-spo2"
			label="Measured oxygen saturation"
			min={50}
			max={100}
			step={1}
			bind:value={o.spo2}
		/>
	</Field>

	<Field label="SpO2 subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
