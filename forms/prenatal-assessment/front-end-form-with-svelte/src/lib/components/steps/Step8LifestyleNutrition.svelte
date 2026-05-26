<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const l = assessment.data.lifestyleNutrition;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const exerciseOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'light', label: 'Light (walking, gentle stretching)' },
		{ value: 'moderate', label: 'Moderate (swimming, prenatal yoga)' },
		{ value: 'vigorous', label: 'Vigorous (running, high-intensity)' }
	];
	const dietOptions = [
		{ value: 'poor', label: 'Poor' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'good', label: 'Good' },
		{ value: 'excellent', label: 'Excellent' }
	];
	const yesNoQuestions: { key: 'smoking' | 'alcohol' | 'drugs' | 'folicAcid'; name: string; label: string }[] = [
		{ key: 'smoking', name: 'smoking', label: 'Smoking during this pregnancy' },
		{ key: 'alcohol', name: 'alcohol', label: 'Alcohol consumption during this pregnancy' },
		{ key: 'drugs', name: 'drugs', label: 'Recreational drug use during this pregnancy' },
		{ key: 'folicAcid', name: 'folicAcid', label: 'Taking folic acid' }
	];
</script>

<Fieldset legend="Lifestyle & Nutrition">
	<p class="hint">Lifestyle factors and nutritional status.</p>

	{#each yesNoQuestions.slice(0, 3) as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={l[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Exercise Level" inputId="exercise">
		<Select id="exercise" label="Exercise level" bind:value={l.exercise}>
			<option value="">-- Select --</option>
			{#each exerciseOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Diet Quality" inputId="diet">
		<Select id="diet" label="Diet quality" bind:value={l.diet}>
			<option value="">-- Select --</option>
			{#each dietOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Current Supplements" inputId="supplements">
		<TextAreaInput id="supplements" label="Supplements" rows={3} bind:value={l.supplements} />
	</Field>

	<Field label="Taking folic acid">
		<RadioGroup label="Folic acid">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="folicAcid" value={opt.value} bind:group={l.folicAcid} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
