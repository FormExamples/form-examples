<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.presentingSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const symptomFields = [
		{ key: 'fatigue', label: 'Fatigue' },
		{ key: 'weightChange', label: 'Weight change' },
		{ key: 'heatIntolerance', label: 'Heat intolerance' },
		{ key: 'coldIntolerance', label: 'Cold intolerance' },
		{ key: 'palpitations', label: 'Palpitations' },
		{ key: 'tremor', label: 'Tremor' },
		{ key: 'sweating', label: 'Excessive sweating' },
		{ key: 'polyuria', label: 'Polyuria (excessive urination)' },
		{ key: 'polydipsia', label: 'Polydipsia (excessive thirst)' },
		{ key: 'mood', label: 'Mood change' },
		{ key: 'skinChanges', label: 'Skin changes' },
		{ key: 'hairChanges', label: 'Hair changes' }
	] as const;
</script>

<Fieldset legend="Presenting Symptoms">
	<p class="hint">Symptom review across the endocrine systems.</p>

	{#each symptomFields as f (f.key)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={f.key} value={opt.value} bind:group={s[f.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	{#if s.weightChange === 'yes'}
		<Field label="Weight change direction" inputId="weightChangeDirection">
			<Select id="weightChangeDirection" label="Weight change direction" bind:value={s.weightChangeDirection}>
				<option value="">-- Select --</option>
				<option value="gain">Weight gain</option>
				<option value="loss">Weight loss</option>
				<option value="fluctuating">Fluctuating</option>
			</Select>
		</Field>
	{/if}

	<Field label="Symptom duration" inputId="symptomDuration">
		<Select id="symptomDuration" label="Symptom duration" bind:value={s.symptomDuration}>
			<option value="">-- Select --</option>
			<option value="less-1-month">Less than 1 month</option>
			<option value="1-6-months">1–6 months</option>
			<option value="6-12-months">6–12 months</option>
			<option value="greater-1-year">Greater than 1 year</option>
		</Select>
	</Field>

	<Field label="Other symptoms" inputId="otherSymptoms">
		<TextAreaInput id="otherSymptoms" label="Other symptoms" rows={3} bind:value={s.otherSymptoms} />
	</Field>
</Fieldset>
