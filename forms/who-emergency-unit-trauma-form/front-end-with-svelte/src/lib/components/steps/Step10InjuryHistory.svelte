<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const i = assessment.data.injuryHistory;

	const roadRoleOptions = [
		{ value: 'driver', label: 'Driver' },
		{ value: 'passenger', label: 'Passenger' },
		{ value: 'pedestrian', label: 'Pedestrian' }
	];

	const prehospitalOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'layperson', label: 'Layperson' },
		{ value: 'healthcare-professional', label: 'Healthcare professional' }
	];

	const locOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'under-5min', label: '< 5 min' },
		{ value: '5-29min', label: '5–29 min' },
		{ value: '30min-24hr', label: '30 min – 24 hr' }
	];

	const intentOptions = [
		{ value: 'unintentional', label: 'Unintentional / accidental' },
		{ value: 'intentional-self-harm', label: 'Intentional — self harm' },
		{ value: 'intentional-assault', label: 'Intentional — assault' },
		{ value: 'legal-political-war', label: 'Legal process / political unrest / war' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const substanceOptions = [
		{ value: 'unknown', label: 'Unknown' },
		{ value: 'none', label: 'None' },
		{ value: 'reported', label: 'Reported' },
		{ value: 'evidence', label: 'Evidence' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Injury History"
	description="Place, activity, mechanism, prehospital care, intent, fasting status and substance use within 6 hours of injury."
>
	<TextInput label="Place of injury" name="placeOfInjury" bind:value={i.placeOfInjury} />
	<Checkbox label="Place of injury: Unknown" name="placeOfInjuryUnknown" bind:checked={i.placeOfInjuryUnknown} />

	<TextInput label="Activity at time of injury" name="activityAtTimeOfInjury" bind:value={i.activityAtTimeOfInjury} />
	<Checkbox label="Activity: Unknown" name="activityAtTimeOfInjuryUnknown" bind:checked={i.activityAtTimeOfInjuryUnknown} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Mechanism of injury</h3>
	<Checkbox label="Road traffic incident" name="mechRoadTrafficIncident" bind:checked={i.mechRoadTrafficIncident} />
	{#if i.mechRoadTrafficIncident}
		<RadioGroup label="Role" name="mechRoadRole" options={roadRoleOptions} bind:value={i.mechRoadRole} />
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput label="Patient vehicle" name="mechPatientVehicle" bind:value={i.mechPatientVehicle} />
			<TextInput label="Impacted with" name="mechImpactedWith" bind:value={i.mechImpactedWith} />
		</div>
		<Checkbox label="Airbag deployed" name="mechAirbag" bind:checked={i.mechAirbag} />
		<Checkbox label="Seat belt worn" name="mechSeatbelt" bind:checked={i.mechSeatbelt} />
		<Checkbox label="Helmet worn" name="mechHelmet" bind:checked={i.mechHelmet} />
		<Checkbox label="Extricated" name="mechExtricated" bind:checked={i.mechExtricated} />
		<Checkbox label="Ejected" name="mechEjected" bind:checked={i.mechEjected} />
	{/if}

	<TextInput label="Fall from (height / details)" name="mechFallFrom" bind:value={i.mechFallFrom} />
	<Checkbox label="Hit by falling object" name="mechHitByFallingObject" bind:checked={i.mechHitByFallingObject} />
	<Checkbox label="Stab / cut" name="mechStabCut" bind:checked={i.mechStabCut} />
	<Checkbox label="Gunshot" name="mechGunshot" bind:checked={i.mechGunshot} />
	<Checkbox label="Sexual assault" name="mechSexualAssault" bind:checked={i.mechSexualAssault} />
	<Checkbox label="Other blunt force trauma" name="mechOtherBluntForce" bind:checked={i.mechOtherBluntForce} />
	<Checkbox label="Suffocation, choking, hanging" name="mechSuffocationChokingHanging" bind:checked={i.mechSuffocationChokingHanging} />
	<Checkbox label="Drowning" name="mechDrowning" bind:checked={i.mechDrowning} />
	{#if i.mechDrowning}
		<RadioGroup label="With life vest?" name="mechDrowningLifeVest" options={yesNo} bind:value={i.mechDrowningLifeVest} />
	{/if}
	<TextInput label="Burn caused by" name="mechBurnCausedBy" bind:value={i.mechBurnCausedBy} />
	<Checkbox label="Poisoning / toxic exposure" name="mechPoisoningToxicExposure" bind:checked={i.mechPoisoningToxicExposure} />
	<Checkbox label="Unknown mechanism" name="mechUnknown" bind:checked={i.mechUnknown} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Prehospital care</h3>
	<TextInput label="First care sought" name="firstCareSought" bind:value={i.firstCareSought} />
	<RadioGroup
		label="Prehospital care provider"
		name="prehospitalCareProvider"
		options={prehospitalOptions}
		bind:value={i.prehospitalCareProvider}
		required
	/>
	<TextAreaInput label="Prehospital care given" name="prehospitalCareGiven" bind:value={i.prehospitalCareGiven} rows={2} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Date / time of injury</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Date of injury" name="dateOfInjury" type="date" bind:value={i.dateOfInjury} required />
		<TextInput label="Time of injury (24h)" name="timeOfInjury" type="time" bind:value={i.timeOfInjury} required />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Details</h3>
	<RadioGroup
		label="Loss of consciousness"
		name="lossOfConsciousnessDuration"
		options={locOptions}
		bind:value={i.lossOfConsciousnessDuration}
	/>
	<Checkbox label="Head trauma" name="headTrauma" bind:checked={i.headTrauma} />
	<Checkbox label="Neck trauma" name="neckTrauma" bind:checked={i.neckTrauma} />
	<TextAreaInput label="Other details" name="otherTraumaDetails" bind:value={i.otherTraumaDetails} rows={2} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Intent</h3>
	<RadioGroup label="Intent of injury" name="intent" options={intentOptions} bind:value={i.intent} required />
	{#if i.intent === 'intentional-assault'}
		<TextInput label="Assaulted by" name="assaultedBy" bind:value={i.assaultedBy} />
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Fasting and substance use</h3>
	<NumberInput label="Hours since last meal" name="hoursSinceLastMeal" bind:value={i.hoursSinceLastMeal} unit="hr" min={0} step={0.5} />
	<Checkbox label="Hours since last meal: Unknown" name="hoursSinceLastMealUnknown" bind:checked={i.hoursSinceLastMealUnknown} />

	<RadioGroup
		label="Substance use within 6 hours of injury"
		name="substanceUseStatus"
		options={substanceOptions}
		bind:value={i.substanceUseStatus}
	/>
	<Checkbox label="Alcohol" name="substanceAlcohol" bind:checked={i.substanceAlcohol} />
	<TextInput label="Other substance" name="substanceOther" bind:value={i.substanceOther} />
</Fieldset>
