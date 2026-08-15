<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { pulsePoint, systolicBloodPressurePoints } from '#lib/engine/gbs-rules.js';
	import { formatPoint } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const h = assessment.data.haemodynamics;
	const sbpPoint = $derived(systolicBloodPressurePoints(assessment.data));
	const pulsePt = $derived(pulsePoint(assessment.data));
</script>

<Fieldset legend="Step 4 of 6 — Haemodynamics">
	<p class="hint">
		Parameters 4 and 5 — systolic blood pressure and pulse at first assessment.
	</p>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="0 points &ge; 110, 1 point 100-109, 2 points 90-99, 3 points &lt; 90 mmHg."
		inputId="haemodynamics-systolicBloodPressure"
	>
		<NumberInput
			id="haemodynamics-systolicBloodPressure"
			label="Systolic blood pressure"
			min={0}
			max={300}
			step={1}
			bind:value={h.systolicBloodPressure}
		/>
	</Field>

	<Field label="Systolic blood pressure points">
		<strong class="text-lg text-base-content">{formatPoint(sbpPoint)}</strong>
	</Field>

	<Field
		label="Pulse (beats/min)"
		description="1 point when pulse &ge; 100 beats/min, otherwise 0."
		inputId="haemodynamics-pulse"
	>
		<NumberInput
			id="haemodynamics-pulse"
			label="Pulse"
			min={0}
			max={300}
			step={1}
			bind:value={h.pulse}
		/>
	</Field>

	<Field label="Pulse point">
		<strong class="text-lg text-base-content">{formatPoint(pulsePt)}</strong>
	</Field>
</Fieldset>
