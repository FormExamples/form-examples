<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { mrsLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.functionalSocial;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	function mrsString(): string {
		return f.mrsScore === null ? '' : String(f.mrsScore);
	}
	function setMrs(v: string) {
		f.mrsScore = v === '' ? null : (Number(v) as 0 | 1 | 2 | 3 | 4 | 5);
	}
</script>

<Fieldset legend="Functional and Social Assessment">
	<p class="hint">Disability, driving, employment, and support needs.</p>

	<Field label="Modified Rankin Scale (mRS)" inputId="mrsScore" description={f.mrsScore !== null ? mrsLabel(f.mrsScore) : undefined}>
		<select
			class="select"
			id="mrsScore"
			aria-label="Modified Rankin Scale"
			value={mrsString()}
			onchange={(e) => setMrs((e.currentTarget as HTMLSelectElement).value)}
		>
			<option value="">-- Select --</option>
			<option value="0">0 - No symptoms</option>
			<option value="1">1 - No significant disability</option>
			<option value="2">2 - Slight disability</option>
			<option value="3">3 - Moderate disability</option>
			<option value="4">4 - Moderately severe disability</option>
			<option value="5">5 - Severe disability</option>
		</select>
	</Field>

	<Field label="Driving status" inputId="drivingStatus">
		<Select id="drivingStatus" label="Driving status" bind:value={f.drivingStatus}>
			<option value="">-- Select --</option>
			<option value="driving">Currently driving</option>
			<option value="not-driving-medical">Not driving - medical reasons</option>
			<option value="not-driving-other">Not driving - other reasons</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>
	{#if f.drivingStatus === 'not-driving-medical'}
		<Field label="Driving restriction details" inputId="drivingDetails">
			<TextAreaInput id="drivingDetails" label="Driving details" rows={2} placeholder="e.g., seizure within last 12 months, DVLA notification" bind:value={f.drivingRestrictionDetails} />
		</Field>
	{/if}

	<Field label="Employment status" inputId="employmentStatus">
		<Select id="employmentStatus" label="Employment status" bind:value={f.employmentStatus}>
			<option value="">-- Select --</option>
			<option value="employed">Employed</option>
			<option value="unemployed">Unemployed</option>
			<option value="retired">Retired</option>
			<option value="disability">On disability</option>
			<option value="student">Student</option>
		</Select>
	</Field>

	<Field label="Impact on employment/daily activities" inputId="employmentImpact">
		<TextAreaInput id="employmentImpact" label="Employment impact" rows={3} placeholder="How has the neurological condition affected work or daily life?" bind:value={f.employmentImpact} />
	</Field>

	<Field label="Support needs" inputId="supportNeeds">
		<TextAreaInput id="supportNeeds" label="Support needs" rows={3} placeholder="e.g., physiotherapy, occupational therapy..." bind:value={f.supportNeeds} />
	</Field>

	<Field label="Living situation" inputId="livingSituation">
		<Select id="livingSituation" label="Living situation" bind:value={f.livingSituation}>
			<option value="">-- Select --</option>
			<option value="independent">Independent</option>
			<option value="with-family">With family/carer</option>
			<option value="assisted-living">Assisted living</option>
			<option value="nursing-home">Nursing home</option>
		</Select>
	</Field>

	<Field label="Is a care plan required?">
		<RadioGroup label="Care plan">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="carePlan" value={opt.value} bind:group={f.carePlanRequired} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
