<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const w = assessment.data.weight;
</script>

<Fieldset legend="Step 3 of 7 — Body weight">
	<p class="hint">
		Calculation input 1 — the patient's body weight in kilograms. The total 24-hour volume is 4 mL ×
		weight × %TBSA, so weight and %TBSA together drive the whole prescription.
	</p>

	<Field
		label="Body weight (kg)"
		description="Use an estimated or documented weight; the urine-output target is also derived from it."
		inputId="weight-weightKg"
	>
		<NumberInput
			id="weight-weightKg"
			label="Body weight"
			min={0}
			max={300}
			step={0.1}
			bind:value={w.weightKg}
		/>
	</Field>
</Fieldset>
