<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.clinicalOutcome;
</script>

<Fieldset title="Clinical Outcome" description="Clinician-rated assessment of the consultation outcome">
	<TextAreaInput
		label="Presenting Complaint"
		name="presentingComplaint"
		bind:value={d.presentingComplaint}
		placeholder="Describe the patient's presenting complaint"
		rows={2}
	/>

	<TextAreaInput
		label="Diagnosis (confirmed or updated)"
		name="diagnosis"
		bind:value={d.diagnosis}
		placeholder="Primary diagnosis established or updated during this encounter"
		rows={2}
	/>

	<TextAreaInput
		label="Treatment Delivered"
		name="treatmentDelivered"
		bind:value={d.treatmentDelivered}
		placeholder="Describe any treatment, advice, or interventions delivered"
		rows={2}
	/>

	<Select
		label="Outcome Classification"
		name="outcomeClassification"
		options={[
			{ value: 'resolved', label: 'Resolved — condition fully resolved' },
			{ value: 'improved', label: 'Improved — condition has improved' },
			{ value: 'unchanged', label: 'Unchanged — no significant change' },
			{ value: 'worsened', label: 'Worsened — condition has deteriorated' },
			{ value: 'died', label: 'Died — patient has died' }
		]}
		bind:value={d.outcomeClassification}
		required
	/>
</Fieldset>
