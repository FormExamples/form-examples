<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = assessment.data.selfManagement;
</script>

<Fieldset legend="Step 10 of 11 — Comorbidities and self-management">
	<p class="hint">
		Recorded comorbidities, self-management plan, rescue pack, and next review interval.
	</p>

	<Field label="Recorded comorbidities" inputId="selfManagement-comorbidities">
		<TextAreaInput
			id="selfManagement-comorbidities"
			label="Recorded comorbidities"
			rows={2}
			placeholder="e.g. ischaemic heart disease, anxiety/depression, osteoporosis."
			bind:value={m.comorbidities}
		/>
	</Field>

	<Field label="Personalised self-management plan in place?" inputId="selfManagement-selfManagementPlan">
		<Select
			id="selfManagement-selfManagementPlan"
			label="Personalised self-management plan in place"
			bind:value={m.selfManagementPlan}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Rescue pack supplied?" inputId="selfManagement-rescuePackSupplied">
		<Select
			id="selfManagement-rescuePackSupplied"
			label="Rescue pack supplied"
			bind:value={m.rescuePackSupplied}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Next review interval" inputId="selfManagement-nextReviewInterval">
		<TextInput
			id="selfManagement-nextReviewInterval"
			label="Next review interval"
			placeholder="e.g. 12 months, or 3 months if unstable"
			bind:value={m.nextReviewInterval}
		/>
	</Field>
</Fieldset>
