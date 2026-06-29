<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientInvolvement;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Patient Involvement" description="Details of any patient affected by the error">
	<RadioGroup
		label="Was a patient involved?"
		name="patientInvolved"
		options={yesNo}
		bind:value={d.patientInvolved}
	/>

	{#if d.patientInvolved === 'yes'}
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput label="Patient First Name" name="patientFirstName" bind:value={d.patientFirstName} />
			<TextInput label="Patient Last Name" name="patientLastName" bind:value={d.patientLastName} />
		</div>
		<TextInput label="NHS Number" name="patientNhsNumber" bind:value={d.patientNhsNumber} />
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput label="Date of Birth" name="patientDateOfBirth" type="date" bind:value={d.patientDateOfBirth} />
			<Select
				label="Sex"
				name="patientSex"
				options={[
					{ value: 'male', label: 'Male' },
					{ value: 'female', label: 'Female' },
					{ value: 'other', label: 'Other' }
				]}
				bind:value={d.patientSex}
			/>
		</div>
		<NumberInput label="Age at Incident" name="patientAgeAtIncident" min={0} max={120} bind:value={d.patientAgeAtIncident} />

		<RadioGroup
			label="Has the patient been informed?"
			name="patientInformed"
			options={yesNo}
			bind:value={d.patientInformed}
		/>
		{#if d.patientInformed === 'yes'}
			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput label="Date Informed" name="patientInformedDate" type="date" bind:value={d.patientInformedDate} />
				<TextInput label="Informed By" name="patientInformedBy" bind:value={d.patientInformedBy} />
			</div>
		{/if}

		<RadioGroup
			label="Does duty of candour apply?"
			name="dutyOfCandourApplies"
			options={yesNo}
			bind:value={d.dutyOfCandourApplies}
		/>
		{#if d.dutyOfCandourApplies === 'yes'}
			<RadioGroup
				label="Has duty of candour been completed?"
				name="dutyOfCandourCompleted"
				options={yesNo}
				bind:value={d.dutyOfCandourCompleted}
			/>
		{/if}
	{/if}
</Fieldset>
