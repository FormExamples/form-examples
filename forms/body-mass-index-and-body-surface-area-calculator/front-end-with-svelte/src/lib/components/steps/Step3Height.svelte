<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const h = assessment.data.height;
</script>

<Fieldset legend="Step 3 of 5 — Measured height">
	<p class="hint">
		Calculation input 1 — the measured height in centimetres. BMI and BSA are computed once both
		this value and the weight have been entered.
	</p>

	<Field
		label="Measured height (cm)"
		description="Plausible adult heights are roughly 100-250 cm; values outside this range raise a verify flag."
		inputId="height-heightCm"
	>
		<NumberInput
			id="height-heightCm"
			label="Measured height"
			min={0}
			max={300}
			step={0.1}
			bind:value={h.heightCm}
		/>
	</Field>
</Fieldset>
