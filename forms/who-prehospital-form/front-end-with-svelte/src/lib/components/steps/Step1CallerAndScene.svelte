<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const c = assessment.data.callerAndScene;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' }
	];

	const callTypeOptions = [
		{ value: 'scene', label: 'Scene call' },
		{ value: 'inter-facility-transfer', label: 'Inter-Facility Transfer' }
	];

	const sceneLocationOptions = [
		{ value: 'residence', label: 'Residence' },
		{ value: 'school', label: 'School' },
		{ value: 'public-building', label: 'Public Building' },
		{ value: 'health-facility', label: 'Health Facility' },
		{ value: 'street', label: 'Street' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset
	title="Caller & Scene"
	description="Caller information, patient identification, scene details, and run timestamps."
>
	<Checkbox label="Mass Casualty incident" name="massCasualty" bind:checked={c.massCasualty} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Caller</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Caller name" name="callerName" bind:value={c.callerName} />
		<TextInput label="Caller phone" name="callerPhone" type="tel" bind:value={c.callerPhone} />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Patient</h3>
	<TextInput label="Patient name" name="patientName" bind:value={c.patientName} required />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Date of birth / age"
			name="dateOfBirthOrAge"
			bind:value={c.dateOfBirthOrAge}
			placeholder="1985-06-15 or 40 yrs"
			required
		/>
		<TextInput label="Occupation" name="occupation" bind:value={c.occupation} />
	</div>
	<RadioGroup label="Sex" name="sex" options={sexOptions} bind:value={c.sex} required />
	<TextInput label="Patient address" name="patientAddress" bind:value={c.patientAddress} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Run</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Date" name="date" type="date" bind:value={c.date} required />
		<TextInput label="Run number" name="runNumber" bind:value={c.runNumber} />
	</div>
	<RadioGroup
		label="Call type"
		name="sceneCallType"
		options={callTypeOptions}
		bind:value={c.sceneCallType}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Scene</h3>
	<Select
		label="Scene location & type"
		name="sceneLocationType"
		options={sceneLocationOptions}
		bind:value={c.sceneLocationType}
		required
	/>
	{#if c.sceneLocationType === 'other'}
		<TextInput
			label="Other scene location detail"
			name="sceneLocationOther"
			bind:value={c.sceneLocationOther}
		/>
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Timestamps</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Call received (24h)"
			name="timeCallReceived"
			type="time"
			bind:value={c.timeCallReceived}
			required
		/>
		<TextInput
			label="En route to scene (24h)"
			name="timeEnRouteToScene"
			type="time"
			bind:value={c.timeEnRouteToScene}
		/>
		<TextInput
			label="Arrived at scene (24h)"
			name="timeArrivedAtScene"
			type="time"
			bind:value={c.timeArrivedAtScene}
			required
		/>
		<TextInput
			label="Transporting (24h)"
			name="timeTransporting"
			type="time"
			bind:value={c.timeTransporting}
		/>
		<TextInput
			label="At facility (24h)"
			name="timeAtFacility"
			type="time"
			bind:value={c.timeAtFacility}
		/>
		<TextInput
			label="In service (24h)"
			name="timeInService"
			type="time"
			bind:value={c.timeInService}
		/>
	</div>
</Fieldset>
