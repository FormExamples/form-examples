<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.cognitiveStatus;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cognitive Status">
	<p class="hint">Dementia stage, cognitive impairment, and delirium history.</p>

	<Field label="Dementia stage" inputId="dementiaStage">
		<Select id="dementiaStage" label="Dementia stage" bind:value={c.dementiaStage}>
			<option value="">-- Select --</option>
			<option value="normal">No dementia / normal</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Cognitive impairment" inputId="cognitiveImpairment">
		<Select id="cognitiveImpairment" label="Cognitive impairment" bind:value={c.cognitiveImpairment}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="MMSE score (0-30)" inputId="mmseScore">
			<NumberInput id="mmseScore" label="MMSE score" min={0} max={30} bind:value={c.mmseScore} />
		</Field>
		<Field label="MMSE date" inputId="mmseDate">
			<DateInput id="mmseDate" label="MMSE date" bind:value={c.mmseDate} />
		</Field>
	</div>

	<Field label="Prior delirium history?">
		<RadioGroup label="Prior delirium history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorDeliriumHistory" value={opt.value} bind:group={c.priorDeliriumHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

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
