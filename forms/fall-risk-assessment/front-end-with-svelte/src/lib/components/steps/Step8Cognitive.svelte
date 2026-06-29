<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.cognitive;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { field: 'dementiaDiagnosis' | 'confusionOrDisorientation' | 'impulsivity' | 'overestimatesAbility' | 'delirium'; label: string }[] = [
		{ field: 'dementiaDiagnosis', label: 'Diagnosis of dementia?' },
		{ field: 'confusionOrDisorientation', label: 'Confusion or disorientation?' },
		{ field: 'impulsivity', label: 'Impulsivity (acts without thinking)?' },
		{ field: 'overestimatesAbility', label: 'Overestimates own physical ability?' },
		{ field: 'delirium', label: 'Acute delirium?' }
	];
</script>

<Fieldset legend="Cognitive Assessment">
	<p class="hint">Cognition, awareness, and behavioural risk factors for falls.</p>

	{#each questions as q (q.field)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.field} value={opt.value} bind:group={c[q.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<div class="field-grid">
		<Field label="Cognitive screen tool used" inputId="cognitiveScreenTool">
			<Select id="cognitiveScreenTool" label="Cognitive screen tool used" bind:value={c.cognitiveScreenTool}>
				<option value="">— Select —</option>
				<option value="mmse">MMSE</option>
				<option value="moca">MoCA</option>
				<option value="4at">4AT</option>
				<option value="amt">AMT (Abbreviated Mental Test)</option>
				<option value="other">Other</option>
				<option value="none">None performed</option>
			</Select>
		</Field>
		<Field label="Cognitive screen score" inputId="cognitiveScreenScore">
			<TextInput id="cognitiveScreenScore" label="Cognitive screen score" placeholder="e.g. 24/30" bind:value={c.cognitiveScreenScore} />
		</Field>
	</div>

	<Field label="Cognitive notes" inputId="cognitiveNotes">
		<TextAreaInput id="cognitiveNotes" label="Cognitive notes" rows={3} bind:value={c.cognitiveNotes} />
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
