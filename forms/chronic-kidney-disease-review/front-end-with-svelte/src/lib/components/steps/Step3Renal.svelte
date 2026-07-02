<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const r = assessment.data.renal;
</script>

<Fieldset legend="Step 3 of 8 — Renal function (eGFR)">
	<p class="hint">
		Current eGFR sets the G-stage; the prior value drives the rapid-decline check.
	</p>

	<Field
		label="Current eGFR (mL/min/1.73 m²)"
		description="G1 &ge; 90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 &lt; 15."
		inputId="renal-egfr"
	>
		<NumberInput
			id="renal-egfr"
			label="Current eGFR (mL/min/1.73 m²)"
			min={1}
			max={200}
			step={0.1}
			placeholder="e.g. 50"
			bind:value={r.egfr}
		/>
	</Field>

	<Field label="eGFR sample date" inputId="renal-egfrSampleDate">
		<DateInput id="renal-egfrSampleDate" label="eGFR sample date" bind:value={r.egfrSampleDate} />
	</Field>

	<Field
		label="Previous eGFR (mL/min/1.73 m²)"
		description="Used for the rapid-decline check (&ge; 25% fall with a G-stage change, or &ge; 15/year)."
		inputId="renal-previousEgfr"
	>
		<NumberInput
			id="renal-previousEgfr"
			label="Previous eGFR (mL/min/1.73 m²)"
			min={1}
			max={200}
			step={0.1}
			placeholder="e.g. 68"
			bind:value={r.previousEgfr}
		/>
	</Field>

	<Field label="Previous eGFR sample date" inputId="renal-previousEgfrDate">
		<DateInput
			id="renal-previousEgfrDate"
			label="Previous eGFR sample date"
			bind:value={r.previousEgfrDate}
		/>
	</Field>
</Fieldset>
