<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const r = assessment.data.recentIllness;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Recent Illness & Infections">
	<p class="hint">Illness, infection, or medical care in recent weeks.</p>

	<Field label="Have you had a fever in the past 2 weeks?">
		<RadioGroup label="Have you had a fever in the past 2 weeks?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="feverPastTwoWeeks" value={opt.value} bind:group={r.feverPastTwoWeeks} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had any infection in the past 2 weeks?">
		<RadioGroup label="Have you had any infection in the past 2 weeks?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="infectionPastTwoWeeks" value={opt.value} bind:group={r.infectionPastTwoWeeks} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you taken antibiotics in the past 7 days?">
		<RadioGroup label="Have you taken antibiotics in the past 7 days?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antibioticsPastSevenDays" value={opt.value} bind:group={r.antibioticsPastSevenDays} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had any dental work in the past week?">
		<RadioGroup label="Have you had any dental work in the past week?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dentalWorkPastWeek" value={opt.value} bind:group={r.dentalWorkPastWeek} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had surgery in the past 6 months?">
		<RadioGroup label="Have you had surgery in the past 6 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="surgeryPastSixMonths" value={opt.value} bind:group={r.surgeryPastSixMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you tested positive for COVID-19 in the past 28 days?">
		<RadioGroup label="Have you tested positive for COVID-19 in the past 28 days?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="covidPositivePastTwentyEightDays" value={opt.value} bind:group={r.covidPositivePastTwentyEightDays} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had any vaccination in the past 4 weeks?">
		<RadioGroup label="Have you had any vaccination in the past 4 weeks?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vaccinationPastFourWeeks" value={opt.value} bind:group={r.vaccinationPastFourWeeks} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.vaccinationPastFourWeeks === 'yes'}
		<Field label="Vaccine type / details" inputId="vaccinationDetails">
			<TextInput id="vaccinationDetails" label="Vaccine type / details" placeholder="e.g. influenza, COVID-19 booster, yellow fever" bind:value={r.vaccinationDetails} />
		</Field>
	{/if}
</Fieldset>
