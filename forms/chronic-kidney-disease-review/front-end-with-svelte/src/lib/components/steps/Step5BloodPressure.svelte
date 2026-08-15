<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const bp = assessment.data.bloodPressure;
</script>

<Fieldset legend="Step 5 of 8 — Blood pressure">
	<p class="hint">
		Best of repeated seated readings (mmHg). Target is 130/80 with diabetes or ACR &ge; 70, else
		140/90.
	</p>

	<Field label="Systolic blood pressure (mmHg)" inputId="bloodPressure-systolicBloodPressure">
		<NumberInput
			id="bloodPressure-systolicBloodPressure"
			label="Systolic blood pressure (mmHg)"
			min={50}
			max={300}
			step={1}
			placeholder="e.g. 138"
			bind:value={bp.systolicBloodPressure}
		/>
	</Field>

	<Field label="Diastolic blood pressure (mmHg)" inputId="bloodPressure-diastolicBloodPressure">
		<NumberInput
			id="bloodPressure-diastolicBloodPressure"
			label="Diastolic blood pressure (mmHg)"
			min={30}
			max={200}
			step={1}
			placeholder="e.g. 84"
			bind:value={bp.diastolicBloodPressure}
		/>
	</Field>
</Fieldset>
