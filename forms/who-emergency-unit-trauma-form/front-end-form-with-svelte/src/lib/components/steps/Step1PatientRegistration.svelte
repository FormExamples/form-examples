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

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const vaxOptions = [
		{ value: 'unknown', label: 'Unknown' },
		{ value: 'no', label: 'No' },
		{ value: 'yes', label: 'Yes' }
	];
</script>

<SectionCard
	title="Patient Registration"
	description="Demographics, arrival mode, residence and injury location."
>
	<TextInput
		label="Hospital registration number / sticker"
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
		label="Age category (if age unavailable)"
		name="ageCategory"
		options={ageCategoryOptions}
		bind:value={p.ageCategory}
	/>

	<RadioGroup label="Sex" name="sex" options={sexOptions} bind:value={p.sex} required />

	<TextInput label="Patient defined racial and ethnic identity" name="racialAndEthnicIdentity" bind:value={p.racialAndEthnicIdentity} />
	<Checkbox label="Racial and ethnic identity: Unknown" name="racialAndEthnicIdentityUnknown" bind:checked={p.racialAndEthnicIdentityUnknown} />

	<RadioGroup label="Is an interpreter required?" name="interpreterRequired" options={yesNo} bind:value={p.interpreterRequired} />

	<TextInput label="Occupation" name="occupation" bind:value={p.occupation} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Contact person</h3>
	<TextInput label="Name" name="contactPerson" bind:value={p.contactPerson} />
	<TextInput label="Phone" name="contactPhone" bind:value={p.contactPhone} type="tel" />
	<TextInput label="Relation" name="contactRelation" bind:value={p.contactRelation} />

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

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Residence and injury location</h3>
	<TextInput label="Patient residence (Address or City/Sub-district)" name="patientResidence" bind:value={p.patientResidence} />
	<Checkbox label="Patient residence: Unknown" name="patientResidenceUnknown" bind:checked={p.patientResidenceUnknown} />

	<TextInput label="Injury location (Sub-district)" name="injuryLocation" bind:value={p.injuryLocation} />
	<Checkbox label="Injury location: Unknown" name="injuryLocationUnknown" bind:checked={p.injuryLocationUnknown} />

	<NumberInput label="Number of prior facilities" name="priorFacilitiesCount" bind:value={p.priorFacilitiesCount} min={0} />
	<TextInput label="Referred from" name="referredFrom" bind:value={p.referredFrom} />

	<RadioGroup label="Safe at home?" name="safeAtHome" options={yesNo} bind:value={p.safeAtHome} />

	<NumberInput label="Weight" name="weightKg" bind:value={p.weightKg} unit="kg" min={0} step={0.1} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Vaccinations</h3>
	<SelectInput label="Vaccinations up to date?" name="vaccinationsStatus" options={vaxOptions} bind:value={p.vaccinationsStatus} />
	{#if p.vaccinationsStatus === 'yes'}
		<TextInput label="Last vaccination date" name="vaccinationsDate" type="date" bind:value={p.vaccinationsDate} />
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Pregnancy</h3>
	<RadioGroup label="Pregnant?" name="pregnant" options={yesNo} bind:value={p.pregnant} />
	{#if p.pregnant === 'yes'}
		<Checkbox label="Pregnancy: Reported" name="pregnancyReported" bind:checked={p.pregnancyReported} />
		<Checkbox label="Pregnancy: Testing done" name="pregnancyTestingDone" bind:checked={p.pregnancyTestingDone} />
	{/if}
	<TextInput label="Last menstrual cycle" name="lastMenstrualCycle" type="date" bind:value={p.lastMenstrualCycle} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Gravida (G)" name="gravida" bind:value={p.gravida} min={0} />
		<NumberInput label="Para (P)" name="para" bind:value={p.para} min={0} />
	</div>
	<Checkbox label="LMP / G&P: Unknown" name="lmpUnknown" bind:checked={p.lmpUnknown} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Substance use</h3>
	<Checkbox label="Tobacco" name="tobaccoUse" bind:checked={p.tobaccoUse} />
	<Checkbox label="Alcohol" name="alcoholUse" bind:checked={p.alcoholUse} />
	<Checkbox label="Drugs" name="drugUse" bind:checked={p.drugUse} />
	<Checkbox label="IV drug use" name="ivDrugUse" bind:checked={p.ivDrugUse} />
	<Checkbox label="Substance use: Unknown" name="substanceUseUnknown" bind:checked={p.substanceUseUnknown} />
</SectionCard>
