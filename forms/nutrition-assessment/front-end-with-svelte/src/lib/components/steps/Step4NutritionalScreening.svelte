<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.nutritionalScreening;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const bmiOptions = [
		{ value: '>=20', label: 'BMI > 20 (score 0)' },
		{ value: '18.5-20', label: 'BMI 18.5-20 (score 1)' },
		{ value: '<18.5', label: 'BMI < 18.5 (score 2)' }
	];
	const weightLossOptions = [
		{ value: '<5', label: '< 5% (score 0)' },
		{ value: '5-10', label: '5 - 10% (score 1)' },
		{ value: '>10', label: '> 10% (score 2)' }
	];
	const acuteOptions = [
		{ value: 'none', label: 'None / not acutely ill (score 0)' },
		{ value: 'acutely-ill-no-intake-5d', label: 'Acutely ill AND no nutritional intake (or likely none) for >5 days (score 2)' }
	];
</script>

<Fieldset legend="Nutritional Screening (MUST)">
	<p class="hint">
		Malnutrition Universal Screening Tool — three-step screen producing an overall risk score (0-6).
		Categories may be pre-filled from the measurements in step 2; you can override them.
	</p>

	<Field label="Step 1: Body Mass Index (BMI) category">
		<RadioGroup label="BMI category">
			{#each bmiOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bmiCategory" value={opt.value} bind:group={s.bmiCategory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Step 2: Unplanned weight loss in the past 3-6 months">
		<RadioGroup label="Weight loss category">
			{#each weightLossOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="weightLossCategory" value={opt.value} bind:group={s.weightLossCategory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Step 3: Acute disease effect">
		<RadioGroup label="Acute disease effect">
			{#each acuteOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="acuteDisease" value={opt.value} bind:group={s.acuteDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Has there been any other unintentional weight loss not captured above?">
		<RadioGroup label="Other unintentional weight loss">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="unintentionalWeightLoss" value={opt.value} bind:group={s.unintentionalWeightLoss} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Has appetite been reduced in the past 7 days?">
		<RadioGroup label="Reduced appetite (7 days)">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reducedAppetite7Days" value={opt.value} bind:group={s.reducedAppetite7Days} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional screening notes" inputId="additionalScreeningNotes">
		<TextAreaInput id="additionalScreeningNotes" label="Additional screening notes" rows={3} placeholder="Any factors not captured above…" bind:value={s.additionalScreeningNotes} />
	</Field>
</Fieldset>
