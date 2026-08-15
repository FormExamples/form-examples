<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.covid19Vaccination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="COVID-19 Vaccination">
	<p class="hint">Primary course, boosters, and any adverse reactions.</p>

	<Field label="COVID-19 primary course complete?">
		<RadioGroup label="COVID-19 primary course complete?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="covidPrimary" value={opt.value} bind:group={c.covidPrimaryCourse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.covidPrimaryCourse === 'yes'}
		<Field label="Primary vaccine type" inputId="covidType">
			<Select id="covidType" label="Primary vaccine type" bind:value={c.covidPrimaryVaccineType}>
				<option value="">-- Select --</option>
				<option value="pfizer">Pfizer</option>
				<option value="moderna">Moderna</option>
				<option value="astrazeneca">AstraZeneca</option>
				<option value="novavax">Novavax</option>
				<option value="janssen">Janssen</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<div class="field-grid">
			<Field label="Dose 1 date" inputId="covidDose1">
				<DateInput id="covidDose1" label="Dose 1 date" bind:value={c.covidDose1Date} />
			</Field>
			<Field label="Dose 2 date" inputId="covidDose2">
				<DateInput id="covidDose2" label="Dose 2 date" bind:value={c.covidDose2Date} />
			</Field>
		</div>

		<Field label="First booster received?">
			<RadioGroup label="First booster received?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="covidBoost1" value={opt.value} bind:group={c.covidBooster1} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if c.covidBooster1 === 'yes'}
			<Field label="First booster date" inputId="covidBoost1Date">
				<DateInput id="covidBoost1Date" label="First booster date" bind:value={c.covidBooster1Date} />
			</Field>
		{/if}

		<Field label="Autumn/seasonal booster received?">
			<RadioGroup label="Autumn/seasonal booster received?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="covidAutumn" value={opt.value} bind:group={c.covidAutumnBooster} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Total COVID-19 doses received" inputId="covidTotal">
			<NumberInput id="covidTotal" label="Total COVID-19 doses received" min={0} max={12} bind:value={c.totalCovidDoses} />
		</Field>
	{/if}

	<Field label="Adverse reaction to a COVID-19 vaccine?">
		<RadioGroup label="Adverse reaction to a COVID-19 vaccine?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="covidAdverse" value={opt.value} bind:group={c.covidAdverseReaction} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.covidAdverseReaction === 'yes'}
		<Field label="Adverse reaction details" inputId="covidAdverseDetails">
			<TextAreaInput id="covidAdverseDetails" label="Adverse reaction details" rows={2} bind:value={c.covidAdverseReactionDetails} />
		</Field>
	{/if}

	<Field label="Notes" inputId="covidNotes">
		<TextAreaInput id="covidNotes" label="Notes" rows={2} bind:value={c.notes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
