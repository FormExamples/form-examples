<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const ig = assessment.data.indicationGoals;

	const indicationOptions = [
		{ value: 'type2-diabetes', label: 'Type 2 Diabetes' },
		{ value: 'weight-management', label: 'Weight Management' },
		{ value: 'cardiovascular-risk-reduction', label: 'Cardiovascular Risk Reduction' }
	];

	const motivationOptions = [
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' }
	];
</script>

<Fieldset legend="Indication &amp; Goals">
	<p class="hint">Primary reason for considering semaglutide therapy and treatment objectives.</p>

	<Field label="Primary Indication" required>
		<RadioGroup label="Primary indication">
			{#each indicationOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="primaryIndication" value={opt.value} bind:group={ig.primaryIndication} required />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Target Weight Loss (% of body weight)" inputId="weightLossGoalPercent">
		<NumberInput id="weightLossGoalPercent" label="Target weight loss" min={0} max={30} step={1} bind:value={ig.weightLossGoalPercent} />
	</Field>

	<Field label="Previous Weight Loss Attempts" inputId="previousWeightLossAttempts">
		<TextAreaInput id="previousWeightLossAttempts" label="Previous weight loss attempts" placeholder="e.g., diet programmes, exercise regimens, previous medications..." bind:value={ig.previousWeightLossAttempts} />
	</Field>

	<Field label="Motivation Level">
		<RadioGroup label="Motivation level">
			{#each motivationOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="motivationLevel" value={opt.value} bind:group={ig.motivationLevel} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
