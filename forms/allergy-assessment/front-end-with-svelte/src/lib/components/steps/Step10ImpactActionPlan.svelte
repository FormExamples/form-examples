<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = $state(assessment.data.impactActionPlan);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Impact & Action Plan">
	<p class="hint">Quality of life, school/work impact, emergency action plan, and follow-up.</p>

	<Field label="Quality of life score (1 = very poor, 10 = excellent)" inputId="qol">
		<NumberInput id="qol" label="Quality of life score" min={1} max={10} step={1} bind:value={p.qualityOfLifeScore} />
	</Field>

	<Field label="Does your allergy impact school or work?">
		<RadioGroup label="School/work impact">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="schoolWorkImpact" value={opt.value} bind:group={p.schoolWorkImpact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.schoolWorkImpact === 'yes'}
		<Field label="School/work impact details" inputId="schoolWorkDetails">
			<TextAreaInput id="schoolWorkDetails" label="School/work impact details" rows={3} bind:value={p.schoolWorkImpactDetails} />
		</Field>
	{/if}

	<Field label="Emergency action plan status" inputId="actionPlanStatus">
		<Select id="actionPlanStatus" label="Emergency action plan status" bind:value={p.emergencyActionPlanStatus}>
			<option value="">— Select —</option>
			<option value="in-place">In place</option>
			<option value="not-in-place">Not in place</option>
			<option value="needs-update">Needs update</option>
		</Select>
	</Field>

	<Field label="Has training been provided on allergy management?">
		<RadioGroup label="Training provided">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="trainingProvided" value={opt.value} bind:group={p.trainingProvided} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.trainingProvided === 'yes'}
		<Field label="Training details" inputId="trainingDetails">
			<TextInput id="trainingDetails" label="Training details" bind:value={p.trainingDetails} />
		</Field>
	{/if}

	<Field label="Follow-up schedule" inputId="followUp">
		<TextInput id="followUp" label="Follow-up schedule" bind:value={p.followUpSchedule} />
	</Field>
</Fieldset>
