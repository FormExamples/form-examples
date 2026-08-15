<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.encounterDetails;
</script>

<Fieldset title="Encounter Details" description="Details about this outpatient appointment">
	<TextInput label="Clinic Date" name="clinicDate" type="date" bind:value={d.clinicDate} required />

	<TextInput
		label="Specialty"
		name="specialty"
		bind:value={d.specialty}
		placeholder="e.g. Cardiology"
		required
	/>

	<TextInput
		label="Clinician Name"
		name="clinicianName"
		bind:value={d.clinicianName}
		placeholder="e.g. Dr Jane Smith"
	/>

	<RadioGroup
		label="Modality"
		name="modality"
		options={[
			{ value: 'in_person', label: 'In Person' },
			{ value: 'telephone', label: 'Telephone' },
			{ value: 'video', label: 'Video' }
		]}
		bind:value={d.modality}
		required
	/>

	<Select
		label="Appointment Type"
		name="appointmentType"
		options={[
			{ value: 'new', label: 'New appointment' },
			{ value: 'follow_up', label: 'Follow-up' },
			{ value: 'pifu', label: 'Patient-Initiated Follow-Up (PIFU)' }
		]}
		bind:value={d.appointmentType}
		required
	/>
</Fieldset>
