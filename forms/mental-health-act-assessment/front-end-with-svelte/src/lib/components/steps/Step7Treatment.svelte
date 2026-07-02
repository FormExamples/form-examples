<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatment;
</script>

<Fieldset legend="Step 7 of 9 — Appropriate treatment (criterion 4, s3)">
	<p class="hint">
		Criterion 4 — for Section 3, appropriate medical treatment must be available.
	</p>

	<Field
		label="Appropriate medical treatment available (criterion 4, s3)"
		inputId="treatment-appropriateTreatmentAvailable"
	>
		<Select
			id="treatment-appropriateTreatmentAvailable"
			label="Appropriate medical treatment available (criterion 4, s3)"
			bind:value={t.appropriateTreatmentAvailable}
		>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Treatment plan summary" inputId="treatment-treatmentPlanSummary">
		<TextAreaInput
			id="treatment-treatmentPlanSummary"
			label="Treatment plan summary"
			rows={3}
			placeholder="Proposed treatment and where it would be provided."
			bind:value={t.treatmentPlanSummary}
		/>
	</Field>
</Fieldset>
