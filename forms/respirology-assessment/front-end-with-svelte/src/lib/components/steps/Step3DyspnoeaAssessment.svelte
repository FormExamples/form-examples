<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const d = assessment.data.dyspnoeaAssessment;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const mrcOptions = [
		{ value: '1', label: 'Grade 1 - Breathless only on strenuous exercise' },
		{ value: '2', label: 'Grade 2 - Breathless when hurrying on level / walking up slight hill' },
		{ value: '3', label: 'Grade 3 - Walks slower than peers on level / stops after ~15 min' },
		{ value: '4', label: 'Grade 4 - Stops for breath after ~100 yards on level' },
		{ value: '5', label: 'Grade 5 - Too breathless to leave house / breathless dressing' }
	];
</script>

<Fieldset legend="Dyspnoea Assessment">
	<p class="hint">MRC Dyspnoea Scale and related symptoms.</p>

	<Field label="MRC Dyspnoea Grade" required inputId="mrcGrade">
		<Select id="mrcGrade" label="MRC grade" required bind:value={d.mrcGrade}>
			<option value="">-- Select --</option>
			{#each mrcOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="What triggers your breathlessness?" inputId="triggers">
		<TextAreaInput id="triggers" label="Triggers" rows={3} bind:value={d.triggers} />
	</Field>

	<Field label="Exercise Tolerance (metres on flat before stopping)" inputId="exerciseTolerance">
		<NumberInput id="exerciseTolerance" label="Exercise tolerance" min={0} max={10000} bind:value={d.exerciseToleranceMetres} />
	</Field>

	<Field label="Do you experience orthopnoea (breathlessness lying flat)?">
		<RadioGroup label="Orthopnoea">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="orthopnoea" value={opt.value} bind:group={d.orthopnoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.orthopnoea === 'yes'}
		<Field label="How many pillows do you use to sleep?" inputId="pillows">
			<NumberInput id="pillows" label="Pillows" min={1} max={10} bind:value={d.orthopnoeaPillows} />
		</Field>
	{/if}

	<Field label="Do you experience paroxysmal nocturnal dyspnoea (PND)?">
		<RadioGroup label="PND">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pnd" value={opt.value} bind:group={d.pnd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
