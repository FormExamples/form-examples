<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.symptoms;
</script>

<Fieldset legend="Step 5 of 9 — Symptoms">
	<p class="hint">
		Abnormal bleeding, discharge, or pain. A symptomatic person is managed on the symptomatic (NICE
		NG12) pathway irrespective of the screening result — a negative screen does not exclude cancer.
	</p>

	<Field label="Symptomatic" inputId="symptoms-symptomatic">
		<Select id="symptoms-symptomatic" label="Symptomatic" bind:value={s.symptomatic}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Symptom detail" inputId="symptoms-symptomDetail">
		<TextAreaInput
			id="symptoms-symptomDetail"
			label="Symptom detail"
			rows={3}
			placeholder="Describe any reported symptoms."
			bind:value={s.symptomDetail}
		/>
	</Field>
</Fieldset>
