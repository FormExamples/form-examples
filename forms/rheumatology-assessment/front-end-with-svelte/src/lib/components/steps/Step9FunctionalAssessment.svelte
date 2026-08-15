<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.functionalAssessment;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Functional Assessment">
	<p class="hint">Functional capacity and disability evaluation.</p>

	<Field label="HAQ-DI Score" description="Health Assessment Questionnaire Disability Index (0 = no disability, 3 = maximum disability)" inputId="haqDiScore">
		<NumberInput id="haqDiScore" label="HAQ-DI score" min={0} max={3} step={0.1} bind:value={d.haqDiScore} />
	</Field>

	<div class="field-grid">
		<Field label="Grip Strength Left (kg)" inputId="gripStrengthLeft">
			<NumberInput id="gripStrengthLeft" label="Grip strength left" min={0} max={100} bind:value={d.gripStrengthLeft} />
		</Field>
		<Field label="Grip Strength Right (kg)" inputId="gripStrengthRight">
			<NumberInput id="gripStrengthRight" label="Grip strength right" min={0} max={100} bind:value={d.gripStrengthRight} />
		</Field>
	</div>

	<Field label="Walking Ability" inputId="walkingAbility">
		<Select id="walkingAbility" label="Walking ability" bind:value={d.walkingAbility}>
			<option value="">-- Select --</option>
			<option value="independent">Independent</option>
			<option value="with-aid">With Walking Aid</option>
			<option value="wheelchair">Wheelchair</option>
			<option value="bedbound">Bedbound</option>
		</Select>
	</Field>

	<Field label="ADL Limitations" inputId="adlLimitations">
		<TextAreaInput id="adlLimitations" label="ADL limitations" placeholder="Describe limitations in activities of daily living..." bind:value={d.adlLimitations} />
	</Field>

	<Field label="Work Disability">
		<RadioGroup label="Work disability">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="workDisability" value={opt.value} bind:group={d.workDisability} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.workDisability === 'yes'}
		<Field label="Work Disability Details" inputId="workDisabilityDetails">
			<TextAreaInput id="workDisabilityDetails" label="Work disability details" placeholder="Type of work disability, duration, impact..." bind:value={d.workDisabilityDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
