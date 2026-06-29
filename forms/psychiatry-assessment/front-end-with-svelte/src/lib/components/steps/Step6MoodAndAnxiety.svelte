<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.moodAndAnxiety;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Mood & Anxiety">
	<p class="hint">Standardised screening scores and symptom assessment.</p>

	<Field label="PHQ-9 Score (brief depression screen)" inputId="phq9" description="0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe">
		<NumberInput id="phq9" label="PHQ-9 score" min={0} max={27} bind:value={m.phq9Score} />
	</Field>

	<Field label="GAD-7 Score (brief anxiety screen)" inputId="gad7" description="0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe">
		<NumberInput id="gad7" label="GAD-7 score" min={0} max={21} bind:value={m.gad7Score} />
	</Field>

	<Field label="Mania screen positive?">
		<RadioGroup label="Mania">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mania" value={opt.value} bind:group={m.maniaScreen} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.maniaScreen === 'yes'}
		<Field label="Mania Details" inputId="maniaDetails">
			<TextAreaInput id="maniaDetails" label="Mania details" rows={3} bind:value={m.maniaDetails} />
		</Field>
	{/if}

	<Field label="Psychotic symptoms present?">
		<RadioGroup label="Psychotic symptoms">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="psychotic" value={opt.value} bind:group={m.psychoticSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.psychoticSymptoms === 'yes'}
		<Field label="Psychotic Symptom Details" inputId="psychoticDetails">
			<TextAreaInput id="psychoticDetails" label="Psychotic details" rows={3} bind:value={m.psychoticDetails} />
		</Field>
	{/if}
</Fieldset>
