<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.functionalStatus;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const exerciseOptions = [
		{ value: 'unable', label: 'Unable to exercise' },
		{ value: 'light-housework', label: 'Light housework only' },
		{ value: 'climb-stairs', label: 'Can climb stairs' },
		{ value: 'moderate-exercise', label: 'Moderate exercise' },
		{ value: 'vigorous-exercise', label: 'Vigorous exercise' }
	];
</script>

<Fieldset legend="Functional Status">
	<p class="hint">Exercise capacity and daily living assessment.</p>

	<Field label="Exercise tolerance" inputId="exerciseTolerance">
		<Select id="exerciseTolerance" label="Exercise tolerance" bind:value={f.exerciseTolerance}>
			<option value="">-- Select --</option>
			{#each exerciseOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="6-Minute Walk Test distance (metres)" inputId="sixMWT">
		<NumberInput id="sixMWT" label="Six-minute walk test" min={0} max={1000} bind:value={f.sixMinuteWalkDistance} />
	</Field>

	<div class="field-grid">
		<Field label="Resting SpO2 (%)" inputId="spo2Rest">
			<NumberInput id="spo2Rest" label="Resting SpO2" min={50} max={100} bind:value={f.oxygenSaturationRest} />
		</Field>
		<Field label="SpO2 on exertion (%)" inputId="spo2Exertion">
			<NumberInput id="spo2Exertion" label="SpO2 exertion" min={50} max={100} bind:value={f.oxygenSaturationExertion} />
		</Field>
	</div>

	<Field label="Do you have limitations in activities of daily living (ADLs)?">
		<RadioGroup label="ADL limitations">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adl" value={opt.value} bind:group={f.adlLimitations} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.adlLimitations === 'yes'}
		<Field label="Please describe your ADL limitations" inputId="adlDetails">
			<TextAreaInput id="adlDetails" label="ADL details" rows={3} bind:value={f.adlDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
