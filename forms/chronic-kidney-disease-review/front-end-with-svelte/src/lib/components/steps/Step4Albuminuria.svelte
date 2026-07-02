<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const a = assessment.data.albuminuria;
</script>

<Fieldset legend="Step 4 of 8 — Albuminuria (urine ACR)">
	<p class="hint">
		Urine ACR sets the A-stage; a missing ACR raises a flag and blocks full KDIGO staging.
	</p>

	<Field
		label="Urine ACR (mg/mmol)"
		description="A1 &lt; 3, A2 3–30, A3 &gt; 30. ACR &ge; 70 raises a referral flag."
		inputId="albuminuria-acr"
	>
		<NumberInput
			id="albuminuria-acr"
			label="Urine ACR (mg/mmol)"
			min={0}
			max={3000}
			step={0.1}
			placeholder="e.g. 40"
			bind:value={a.acr}
		/>
	</Field>

	<Field label="ACR sample date" inputId="albuminuria-acrSampleDate">
		<DateInput
			id="albuminuria-acrSampleDate"
			label="ACR sample date"
			bind:value={a.acrSampleDate}
		/>
	</Field>

	<Field
		label="ACR measured this review"
		description="No raises a missing-ACR flag."
		inputId="albuminuria-acrMeasured"
	>
		<Select id="albuminuria-acrMeasured" label="ACR measured this review" bind:value={a.acrMeasured}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
