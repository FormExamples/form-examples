<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.influenzaVaccination;
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

<Fieldset legend="Influenza Vaccination">
	<p class="hint">Current season flu vaccine and high-risk status.</p>

	<Field label="Current season flu vaccine received?">
		<RadioGroup label="Current season flu vaccine received?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fluCurrent" value={opt.value} bind:group={f.fluVaccineCurrentSeason} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.fluVaccineCurrentSeason === 'yes'}
		<div class="field-grid">
			<Field label="Date given" inputId="fluDate">
				<DateInput id="fluDate" label="Date given" bind:value={f.fluVaccineCurrentDate} />
			</Field>
			<Field label="Vaccine type" inputId="fluType">
				<Select id="fluType" label="Vaccine type" bind:value={f.fluVaccineType}>
					<option value="">-- Select --</option>
					<option value="standard">Standard</option>
					<option value="adjuvanted">Adjuvanted</option>
					<option value="cell-based">Cell-based</option>
					<option value="recombinant">Recombinant</option>
					<option value="nasal-spray">Nasal spray</option>
					<option value="other">Other</option>
				</Select>
			</Field>
		</div>
	{/if}

	<Field label="Previous season flu vaccine?" inputId="fluPrev">
		<Select id="fluPrev" label="Previous season flu vaccine?" bind:value={f.fluVaccinePreviousSeason}>
			<option value="">-- Select --</option>
			{#each yesNoUnknown as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Annual flu vaccine recipient?">
		<RadioGroup label="Annual flu vaccine recipient?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fluAnnual" value={opt.value} bind:group={f.fluVaccineAnnualRecipient} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In a flu high-risk group?">
		<RadioGroup label="In a flu high-risk group?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fluHighRisk" value={opt.value} bind:group={f.fluHighRiskGroup} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.fluHighRiskGroup === 'yes'}
		<Field label="High-risk reason" inputId="fluRiskReason">
			<Select id="fluRiskReason" label="High-risk reason" bind:value={f.fluHighRiskReason}>
				<option value="">-- Select --</option>
				<option value="age-65-plus">Age 65+</option>
				<option value="chronic-respiratory">Chronic respiratory disease</option>
				<option value="chronic-heart">Chronic heart disease</option>
				<option value="chronic-kidney">Chronic kidney disease</option>
				<option value="chronic-liver">Chronic liver disease</option>
				<option value="diabetes">Diabetes</option>
				<option value="immunosuppressed">Immunosuppressed</option>
				<option value="pregnant">Pregnant</option>
				<option value="healthcare-worker">Healthcare worker</option>
				<option value="carer">Carer</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Adverse reaction to a flu vaccine?">
		<RadioGroup label="Adverse reaction to a flu vaccine?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fluAdverse" value={opt.value} bind:group={f.fluAdverseReaction} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.fluAdverseReaction === 'yes'}
		<Field label="Adverse reaction details" inputId="fluAdverseDetails">
			<TextAreaInput id="fluAdverseDetails" label="Adverse reaction details" rows={2} bind:value={f.fluAdverseReactionDetails} />
		</Field>
	{/if}

	<Field label="Notes" inputId="fluNotes">
		<TextAreaInput id="fluNotes" label="Notes" rows={2} bind:value={f.notes} />
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
