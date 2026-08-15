<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.exacerbationHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Exacerbation History">
	<p class="hint">Asthma flare-ups and emergency care in the past 12 months.</p>

	<Field label="Number of exacerbations in the last 12 months" inputId="exacerbationsLastYear">
		<NumberInput id="exacerbationsLastYear" label="Exacerbations" min={0} max={100} bind:value={e.exacerbationsLastYear} />
	</Field>

	<Field label="Number of ED visits for asthma in the last 12 months" inputId="edVisitsLastYear">
		<NumberInput id="edVisitsLastYear" label="ED visits" min={0} max={100} bind:value={e.edVisitsLastYear} />
	</Field>

	<Field label="Number of hospitalisations for asthma in the last 12 months" inputId="hospitalisationsLastYear">
		<NumberInput id="hospitalisationsLastYear" label="Hospitalisations" min={0} max={100} bind:value={e.hospitalisationsLastYear} />
	</Field>

	<Field label="Have you ever been admitted to ICU for asthma?">
		<RadioGroup label="ICU admissions">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="icuAdmissions" value={opt.value} bind:group={e.icuAdmissions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if e.icuAdmissions === 'yes'}
		<Field label="How many times?" inputId="icuAdmissionCount">
			<NumberInput id="icuAdmissionCount" label="ICU admission count" min={1} max={100} bind:value={e.icuAdmissionCount} />
		</Field>
	{/if}

	<Field label="Have you ever been intubated (put on a ventilator) for asthma?">
		<RadioGroup label="Intubation history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="intubationHistory" value={opt.value} bind:group={e.intubationHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Number of oral steroid courses in the last 12 months" inputId="oralSteroidCoursesLastYear">
		<NumberInput id="oralSteroidCoursesLastYear" label="Oral steroid courses" min={0} max={100} bind:value={e.oralSteroidCoursesLastYear} />
	</Field>

	<Field label="Date of last exacerbation" inputId="lastExacerbationDate">
		<DateInput id="lastExacerbationDate" label="Last exacerbation date" bind:value={e.lastExacerbationDate} />
	</Field>
</Fieldset>
