<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const c = assessment.data.calcium;
</script>

<Fieldset legend="Step 3 of 6 — Total calcium">
	<p class="hint">
		Calculation input 1 — the measured total serum calcium in mmol/L. The albumin correction is
		applied once both this value and the serum albumin have been entered.
	</p>

	<Field
		label="Measured total calcium (mmol/L)"
		description="Adult total-calcium results are typically around 2.10-2.60 mmol/L."
		inputId="calcium-totalCalcium"
	>
		<NumberInput
			id="calcium-totalCalcium"
			label="Measured total calcium"
			min={0}
			max={5}
			step={0.01}
			bind:value={c.totalCalcium}
		/>
	</Field>
</Fieldset>
