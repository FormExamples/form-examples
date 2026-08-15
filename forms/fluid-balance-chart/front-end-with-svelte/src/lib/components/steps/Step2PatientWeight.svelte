<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 5 — Patient weight">
	<p class="hint">
		Recorded weight enables the weight-indexed urine-output rate in mL/kg/h and the oliguria /
		anuria checks.
	</p>

	<Field
		label="Weight (kg)"
		description="Required for the mL/kg/h urine-output rate and the oliguria / anuria checks."
		inputId="patient-weightKg"
	>
		<NumberInput id="patient-weightKg" label="Weight (kg)" min={0} max={400} step="any" bind:value={p.weightKg} />
	</Field>
</Fieldset>
