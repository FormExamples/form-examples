<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const w = assessment.data.weight;
</script>

<Fieldset legend="Step 4 of 5 — Measured weight">
	<p class="hint">
		Calculation input 2 — the measured weight in kilograms. BMI = weight ÷ height²; BSA follows the
		Mosteller and Du Bois formulae.
	</p>

	<Field
		label="Measured weight (kg)"
		description="Plausible adult weights are roughly 20-400 kg; values outside this range raise a verify flag."
		inputId="weight-weightKg"
	>
		<NumberInput
			id="weight-weightKg"
			label="Measured weight"
			min={0}
			max={500}
			step={0.1}
			bind:value={w.weightKg}
		/>
	</Field>
</Fieldset>
