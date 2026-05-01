<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';

	const i = assessment.data.injuryDetails;
	const cv = assessment.data.chiefComplaintAndVitals;

	const intentOptions = [
		{ value: 'intentional', label: 'Intentional' },
		{ value: 'unintentional', label: 'Unintentional' },
		{ value: 'self-inflicted', label: 'Self-inflicted' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const vehicleOptions = [
		{ value: 'car', label: 'Car' },
		{ value: 'bike', label: 'Bike' },
		{ value: 'motorbike', label: 'Motorbike' },
		{ value: 'other', label: 'Other' }
	];
</script>

<SectionCard
	title="Injury Details"
	description='Complete this section when "Injury" is checked. Capture intent, mechanism, road traffic details, and safety equipment.'
>
	{#if !cv.injury}
		<p class="mb-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
			"Injury" is not checked on Step 2. This section is optional unless this encounter
			involves an injury.
		</p>
	{/if}

	<RadioGroup
		label="Intent"
		name="intent"
		options={intentOptions}
		bind:value={i.intent}
		required={cv.injury}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Mechanism</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Fall" name="mechanismFall" bind:checked={i.mechanismFall} />
		<Checkbox
			label="Hit by falling object"
			name="mechanismHitByFallingObject"
			bind:checked={i.mechanismHitByFallingObject}
		/>
		<Checkbox label="Stab / cut" name="mechanismStabCut" bind:checked={i.mechanismStabCut} />
		<Checkbox label="Gunshot" name="mechanismGunshot" bind:checked={i.mechanismGunshot} />
		<Checkbox
			label="Sexual assault"
			name="mechanismSexualAssault"
			bind:checked={i.mechanismSexualAssault}
		/>
		<Checkbox
			label="Other blunt force trauma"
			name="mechanismOtherBluntForce"
			bind:checked={i.mechanismOtherBluntForce}
		/>
		<Checkbox
			label="Suffocation, choking, hanging"
			name="mechanismSuffocationChokingHanging"
			bind:checked={i.mechanismSuffocationChokingHanging}
		/>
		<Checkbox label="Drowning" name="mechanismDrowning" bind:checked={i.mechanismDrowning} />
		<Checkbox
			label="Poisoning / toxic exposure"
			name="mechanismPoisoningToxicExposure"
			bind:checked={i.mechanismPoisoningToxicExposure}
		/>
		<Checkbox label="Unknown" name="mechanismUnknown" bind:checked={i.mechanismUnknown} />
	</div>
	{#if i.mechanismDrowning}
		<RadioGroup
			label="Drowning: life vest worn?"
			name="mechanismDrowningLifeVest"
			options={yesNo}
			bind:value={i.mechanismDrowningLifeVest}
		/>
	{/if}
	<TextInput
		label="Burn caused by"
		name="mechanismBurnCausedBy"
		bind:value={i.mechanismBurnCausedBy}
	/>
	<TextInput
		label="Other mechanism"
		name="mechanismOther"
		bind:value={i.mechanismOther}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Road traffic incident</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Driver" name="roadTrafficDriver" bind:checked={i.roadTrafficDriver} />
		<Checkbox
			label="Passenger"
			name="roadTrafficPassenger"
			bind:checked={i.roadTrafficPassenger}
		/>
		<Checkbox
			label="Pedestrian"
			name="roadTrafficPedestrian"
			bind:checked={i.roadTrafficPedestrian}
		/>
		<Checkbox label="Ejected" name="roadTrafficEjected" bind:checked={i.roadTrafficEjected} />
		<Checkbox
			label="Extricated"
			name="roadTrafficExtricated"
			bind:checked={i.roadTrafficExtricated}
		/>
	</div>

	<SelectInput
		label="Vehicle"
		name="vehicleType"
		options={vehicleOptions}
		bind:value={i.vehicleType}
	/>
	{#if i.vehicleType === 'other'}
		<TextInput label="Other vehicle" name="vehicleOther" bind:value={i.vehicleOther} />
	{/if}

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Safety equipment</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Airbag" name="safetyAirbag" bind:checked={i.safetyAirbag} />
		<Checkbox label="Seatbelt" name="safetySeatbelt" bind:checked={i.safetySeatbelt} />
		<Checkbox label="Helmet" name="safetyHelmet" bind:checked={i.safetyHelmet} />
	</div>
	<TextInput
		label="Other restraint"
		name="safetyOtherRestraint"
		bind:value={i.safetyOtherRestraint}
	/>
</SectionCard>
