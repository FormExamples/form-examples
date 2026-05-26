<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const mh = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Previous and ongoing medical conditions.</p>

	<Field label="Does the child have any chronic conditions?">
		<RadioGroup label="Chronic conditions">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chronic" value={opt.value} bind:group={mh.chronicConditions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if mh.chronicConditions === 'yes'}
		<Field label="Please describe chronic conditions" inputId="chronicDetails">
			<TextAreaInput id="chronicDetails" label="Chronic condition details" rows={3} bind:value={mh.chronicConditionDetails} />
		</Field>
	{/if}

	<Field label="Has the child had any previous hospitalizations?">
		<RadioGroup label="Hospitalizations">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hospitalizations" value={opt.value} bind:group={mh.previousHospitalizations} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if mh.previousHospitalizations === 'yes'}
		<Field label="Please describe hospitalizations" inputId="hospitalDetails">
			<TextAreaInput id="hospitalDetails" label="Hospitalization details" rows={3} bind:value={mh.hospitalizationDetails} />
		</Field>
	{/if}

	<Field label="Has the child had any previous surgeries?">
		<RadioGroup label="Previous surgeries">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="surgeries" value={opt.value} bind:group={mh.previousSurgeries} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if mh.previousSurgeries === 'yes'}
		<Field label="Please describe surgeries" inputId="surgeryDetails">
			<TextAreaInput id="surgeryDetails" label="Surgery details" rows={3} bind:value={mh.surgeryDetails} />
		</Field>
	{/if}

	<Field label="Does the child have recurring infections?">
		<RadioGroup label="Recurring infections">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="infections" value={opt.value} bind:group={mh.recurringInfections} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if mh.recurringInfections === 'yes'}
		<Field label="Please describe recurring infections" inputId="infectionDetails">
			<TextAreaInput id="infectionDetails" label="Infection details" rows={3} bind:value={mh.infectionDetails} />
		</Field>
	{/if}
</Fieldset>
