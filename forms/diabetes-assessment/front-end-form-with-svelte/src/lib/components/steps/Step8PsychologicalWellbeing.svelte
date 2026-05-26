<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import LikertGroup from '$lib/components/ui/LikertGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.psychologicalWellbeing;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const distressOptions = [
		{ value: 1, label: 'Not at all' },
		{ value: 2, label: 'A little' },
		{ value: 3, label: 'Moderate' },
		{ value: 4, label: 'Quite a bit' },
		{ value: 5, label: 'Very much' }
	];

	const fearOptions = [
		{ value: 1, label: 'None' },
		{ value: 2, label: 'Mild' },
		{ value: 3, label: 'Moderate' },
		{ value: 4, label: 'Significant' },
		{ value: 5, label: 'Severe' }
	];

	const copingOptions = [
		{ value: 1, label: 'Very Poor' },
		{ value: 2, label: 'Poor' },
		{ value: 3, label: 'Fair' },
		{ value: 4, label: 'Good' },
		{ value: 5, label: 'Very Good' }
	];
</script>

<Fieldset legend="Psychological Wellbeing">
	<p class="hint">Assess psychological impact of diabetes and support needs.</p>

	<Field label="Diabetes Distress (how bothered are you by managing diabetes?)">
		<LikertGroup label="Diabetes Distress" name="diabetesDistress" options={distressOptions} bind:value={d.diabetesDistress} />
	</Field>

	<div class="field-grid">
		<Field label="Depression Screening (PHQ-2 score, 0-6)" inputId="depressionScreening">
			<NumberInput id="depressionScreening" label="Depression Screening" min={0} max={10} placeholder="e.g. 2" bind:value={d.depressionScreening} />
		</Field>
		<Field label="Anxiety Screening (GAD-2 score, 0-6)" inputId="anxietyScreening">
			<NumberInput id="anxietyScreening" label="Anxiety Screening" min={0} max={10} placeholder="e.g. 1" bind:value={d.anxietyScreening} />
		</Field>
	</div>

	<Field label="Eating Disorder Concerns">
		<RadioGroup label="Eating Disorder Concerns">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eatingDisorder" value={opt.value} bind:group={d.eatingDisorder} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fear of Hypoglycaemia">
		<LikertGroup label="Fear of Hypoglycaemia" name="fearOfHypoglycaemia" options={fearOptions} bind:value={d.fearOfHypoglycaemia} />
	</Field>

	<Field label="Coping Ability (how well are you managing living with diabetes?)">
		<LikertGroup label="Coping Ability" name="copingAbility" options={copingOptions} bind:value={d.copingAbility} />
	</Field>

	<Field label="Needs Psychological Support">
		<RadioGroup label="Needs Psychological Support">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsSupport" value={opt.value} bind:group={d.needsSupport} /> {opt.label}</label>
			{/each}
		</RadioGroup>
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
