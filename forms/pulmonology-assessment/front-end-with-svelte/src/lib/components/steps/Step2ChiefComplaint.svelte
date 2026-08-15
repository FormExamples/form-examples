<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.chiefComplaint;
	const dyspnoeaOptions = [
		{ value: '1', label: 'Grade 1 - Breathless only with strenuous exercise' },
		{ value: '2', label: 'Grade 2 - Short of breath when hurrying on level ground' },
		{ value: '3', label: 'Grade 3 - Walks slower than contemporaries or stops for breath' },
		{ value: '4', label: 'Grade 4 - Stops for breath after ~100m on level ground' },
		{ value: '5', label: 'Grade 5 - Too breathless to leave the house or dress' }
	];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary reason for this pulmonology visit.</p>

	<Field label="Primary symptom" required inputId="primarySymptom">
		<TextInput id="primarySymptom" label="Primary symptom" required bind:value={c.primarySymptom} />
	</Field>

	<Field label="Duration of symptoms" required inputId="symptomDuration" description="e.g., 6 months, 2 years">
		<TextInput id="symptomDuration" label="Symptom duration" required bind:value={c.symptomDuration} />
	</Field>

	<Field label="MRC Dyspnoea Grade" required inputId="dyspnoeaGrade">
		<Select id="dyspnoeaGrade" label="MRC dyspnoea grade" required bind:value={c.dyspnoeaGradeMRC}>
			<option value="">-- Select --</option>
			{#each dyspnoeaOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
</Fieldset>
