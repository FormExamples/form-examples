<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const p = assessment.data.patientRegistration;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];

	const ageCategoryOptions = [
		{ value: 'infant', label: 'Infant' },
		{ value: 'child', label: 'Child' },
		{ value: 'adult', label: 'Adult' }
	];

	const arrivalModeOptions = [
		{ value: 'ambulance', label: 'Ambulance' },
		{ value: 'car-private', label: 'Car/Truck (Private)' },
		{ value: 'car-taxi', label: 'Car/Truck (Taxi)' },
		{ value: 'motor-2-3-private', label: 'Motorized 2/3-wheeler (Private)' },
		{ value: 'motor-2-3-taxi', label: 'Motorized 2/3-wheeler (Taxi)' },
		{ value: 'public-transport', label: 'Public Transport' },
		{ value: 'walk', label: 'Walk' },
		{ value: 'other', label: 'Other' }
	];

	const ambulanceLevelOptions = [
		{ value: 'basic', label: 'Basic' },
		{ value: 'advanced', label: 'Advanced' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Patient Registration"
	description="Demographics, arrival mode, ambulance details and emergency-system timestamps."
>
	<TextInput
		label="Hospital registration number"
		name="hospitalRegistrationNumber"
		bind:value={p.hospitalRegistrationNumber}
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Patient surname (family name)"
			name="surname"
			bind:value={p.surname}
			placeholder="DOE"
			required
		/>
		<TextInput
			label="Patient first name (given name)"
			name="firstName"
			bind:value={p.firstName}
			placeholder="Jane"
			required
		/>
	</div>

	<RadioGroup label="Sex" name="sex" options={sexOptions} bind:value={p.sex} required />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Date of birth"
			name="dateOfBirth"
			type="date"
			bind:value={p.dateOfBirth}
			required
		/>
		<NumberInput label="Age" name="age" bind:value={p.age} min={0} max={130} />
	</div>

	<SelectInput
		label="Age category"
		name="ageCategory"
		options={ageCategoryOptions}
		bind:value={p.ageCategory}
	/>

	<NumberInput label="Weight" name="weightKg" bind:value={p.weightKg} unit="kg" min={0} step={0.1} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Arrival</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Date of arrival" name="dateOfArrival" type="date" bind:value={p.dateOfArrival} required />
		<TextInput label="Time of arrival (24h)" name="timeOfArrival" type="time" bind:value={p.timeOfArrival} required />
	</div>

	<SelectInput
		label="Arrival mode"
		name="arrivalMode"
		options={arrivalModeOptions}
		bind:value={p.arrivalMode}
		required
	/>

	{#if p.arrivalMode === 'ambulance'}
		<RadioGroup
			label="Ambulance level"
			name="ambulanceLevel"
			options={ambulanceLevelOptions}
			bind:value={p.ambulanceLevel}
			required
		/>
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Emergency system timestamps</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Activation date" name="emergencySystemActivationDate" type="date" bind:value={p.emergencySystemActivationDate} />
		<TextInput label="Activation time (24h)" name="emergencySystemActivationTime" type="time" bind:value={p.emergencySystemActivationTime} />
		<TextInput label="Dispatch date" name="emergencySystemDispatchDate" type="date" bind:value={p.emergencySystemDispatchDate} />
		<TextInput label="Dispatch time (24h)" name="emergencySystemDispatchTime" type="time" bind:value={p.emergencySystemDispatchTime} />
		<TextInput label="Personnel arrival date" name="emergencyPersonnelArrivalDate" type="date" bind:value={p.emergencyPersonnelArrivalDate} />
		<TextInput label="Personnel arrival time (24h)" name="emergencyPersonnelArrivalTime" type="time" bind:value={p.emergencyPersonnelArrivalTime} />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Background &amp; identifiers</h3>
	<TextInput label="Occupation" name="occupation" bind:value={p.occupation} />

	<TextInput label="Patient residence" name="patientResidence" bind:value={p.patientResidence} />
	<Checkbox label="Patient residence: Unknown" name="patientResidenceUnknown" bind:checked={p.patientResidenceUnknown} />

	<TextInput label="Patient defined racial and ethnic identity" name="racialAndEthnicIdentity" bind:value={p.racialAndEthnicIdentity} />
	<Checkbox label="Racial and ethnic identity: Unknown" name="racialAndEthnicIdentityUnknown" bind:checked={p.racialAndEthnicIdentityUnknown} />

	<RadioGroup label="Is an interpreter required?" name="interpreterRequired" options={yesNo} bind:value={p.interpreterRequired} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Contact person</h3>
	<TextInput label="Name" name="contactPerson" bind:value={p.contactPerson} />
	<TextInput label="Phone" name="contactPhone" bind:value={p.contactPhone} type="tel" />
	<TextInput label="Relation" name="contactRelation" bind:value={p.contactRelation} />

	<NumberInput label="Number of prior facilities" name="priorFacilitiesCount" bind:value={p.priorFacilitiesCount} min={0} />
	<TextInput label="Referred from" name="referredFrom" bind:value={p.referredFrom} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Status</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Ambulatory" name="ambulatory" bind:checked={p.ambulatory} />
		<Checkbox label="Non-Ambulatory" name="nonAmbulatory" bind:checked={p.nonAmbulatory} />
		<Checkbox label="Acute" name="acute" bind:checked={p.acute} />
		<Checkbox label="Chronic" name="chronic" bind:checked={p.chronic} />
	</div>
	<RadioGroup
		label="Day-to-day activities limited by health problem or disability (including old age)?"
		name="dailyActivitiesLimited"
		options={yesNo}
		bind:value={p.dailyActivitiesLimited}
	/>
</SectionCard>
