<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.incidentDetails;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Incident Details" description="When, where, and what happened">
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Incident Date" name="incidentDate" type="date" bind:value={d.incidentDate} required />
		<TextInput label="Incident Time" name="incidentTime" type="time" bind:value={d.incidentTime} />
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Discovery Date" name="discoveryDate" type="date" bind:value={d.discoveryDate} />
		<TextInput label="Discovery Time" name="discoveryTime" type="time" bind:value={d.discoveryTime} />
	</div>

	<Select
		label="Location Type"
		name="locationType"
		options={[
			{ value: 'inpatient-ward', label: 'Inpatient Ward' },
			{ value: 'outpatient-clinic', label: 'Outpatient Clinic' },
			{ value: 'emergency-department', label: 'Emergency Department' },
			{ value: 'operating-theatre', label: 'Operating Theatre' },
			{ value: 'pharmacy', label: 'Pharmacy' },
			{ value: 'laboratory', label: 'Laboratory' },
			{ value: 'radiology', label: 'Radiology' },
			{ value: 'community', label: 'Community' },
			{ value: 'other', label: 'Other' }
		]}
		bind:value={d.locationType}
		required
	/>
	<TextInput label="Location Details" name="locationDetails" bind:value={d.locationDetails} />

	<TextAreaInput
		label="Incident Summary"
		name="incidentSummary"
		rows={4}
		bind:value={d.incidentSummary}
		required
	/>

	<RadioGroup
		label="Was the incident witnessed?"
		name="incidentWitnessed"
		options={yesNo}
		bind:value={d.incidentWitnessed}
	/>
	{#if d.incidentWitnessed === 'yes'}
		<TextInput label="Witness Details" name="witnessDetails" bind:value={d.witnessDetails} />
	{/if}

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Select
			label="Shift Type"
			name="shiftType"
			options={[
				{ value: 'day', label: 'Day' },
				{ value: 'evening', label: 'Evening' },
				{ value: 'night', label: 'Night' },
				{ value: 'weekend', label: 'Weekend' },
				{ value: 'bank-holiday', label: 'Bank Holiday' }
			]}
			bind:value={d.shiftType}
		/>
		<Select
			label="Staffing Level"
			name="staffingLevel"
			options={[
				{ value: 'adequate', label: 'Adequate' },
				{ value: 'understaffed', label: 'Understaffed' },
				{ value: 'overstaffed', label: 'Overstaffed' },
				{ value: 'unknown', label: 'Unknown' }
			]}
			bind:value={d.staffingLevel}
		/>
	</div>
</Fieldset>
