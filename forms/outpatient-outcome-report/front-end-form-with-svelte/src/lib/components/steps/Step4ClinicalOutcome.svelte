<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';

	const d = assessment.data.clinicalOutcome;
</script>

<SectionCard title="Clinical Outcome" description="Clinician-rated assessment of the consultation outcome">
	<TextArea
		label="Presenting Complaint"
		name="presentingComplaint"
		bind:value={d.presentingComplaint}
		placeholder="Describe the patient's presenting complaint"
		rows={2}
	/>

	<TextArea
		label="Diagnosis (confirmed or updated)"
		name="diagnosis"
		bind:value={d.diagnosis}
		placeholder="Primary diagnosis established or updated during this encounter"
		rows={2}
	/>

	<TextArea
		label="Treatment Delivered"
		name="treatmentDelivered"
		bind:value={d.treatmentDelivered}
		placeholder="Describe any treatment, advice, or interventions delivered"
		rows={2}
	/>

	<SelectInput
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
</SectionCard>
