<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.infectiousDiseaseScreening;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type ScreenField =
		| 'hivStatus'
		| 'hbsAg'
		| 'hbcAb'
		| 'hcvAb'
		| 'htlvStatus'
		| 'cmvStatus'
		| 'ebvStatus'
		| 'syphilisScreen'
		| 'toxoplasmaStatus'
		| 'tuberculosisScreen';

	const screens: { field: ScreenField; label: string }[] = [
		{ field: 'hivStatus', label: 'HIV' },
		{ field: 'hbsAg', label: 'Hepatitis B (HBsAg)' },
		{ field: 'hbcAb', label: 'Hepatitis B (anti-HBc)' },
		{ field: 'hcvAb', label: 'Hepatitis C antibody' },
		{ field: 'htlvStatus', label: 'HTLV' },
		{ field: 'cmvStatus', label: 'CMV' },
		{ field: 'ebvStatus', label: 'EBV' },
		{ field: 'syphilisScreen', label: 'Syphilis' },
		{ field: 'toxoplasmaStatus', label: 'Toxoplasma' },
		{ field: 'tuberculosisScreen', label: 'Tuberculosis' }
	];
</script>

<Fieldset legend="5. Infectious Disease Screening">
	<p class="hint">Mandatory donor virology and infection screening.</p>

	{#each screens as s (s.field)}
		<Field label={s.label} inputId={s.field}>
			<Select id={s.field} label={s.label} bind:value={d[s.field]}>
				<option value="">-- Select --</option>
				<option value="negative">Negative</option>
				<option value="positive">Positive</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	{/each}

	<Field label="Recent travel to areas with endemic infections?">
		<RadioGroup label="Recent travel to areas with endemic infections?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recentTravel" value={opt.value} bind:group={d.recentTravel} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.recentTravel === 'yes'}
		<Field label="Travel details" inputId="travelDetails">
			<TextAreaInput id="travelDetails" label="Travel details" rows={2} placeholder="Country, dates, exposures, prophylaxis…" bind:value={d.travelDetails} />
		</Field>
	{/if}

	<Field label="Any recent infection (last 3 months)?">
		<RadioGroup label="Any recent infection (last 3 months)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recentInfection" value={opt.value} bind:group={d.recentInfection} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.recentInfection === 'yes'}
		<Field label="Infection details" inputId="infectionDetails">
			<TextAreaInput id="infectionDetails" label="Infection details" rows={2} placeholder="Type, date, treatment, current status…" bind:value={d.infectionDetails} />
		</Field>
	{/if}
</Fieldset>
