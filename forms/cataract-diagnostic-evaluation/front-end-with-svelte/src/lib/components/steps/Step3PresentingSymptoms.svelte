<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="3. Presenting Complaint &amp; Visual Symptoms">
	<Field label="Blurred vision" inputId="symptoms-blurredVision">
		<Select id="symptoms-blurredVision" label="Blurred vision" bind:value={d.symptoms.blurredVision}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Glare or halos" inputId="symptoms-glareOrHalos">
		<Select id="symptoms-glareOrHalos" label="Glare or halos" bind:value={d.symptoms.glareOrHalos}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Night-driving difficulty" inputId="symptoms-nightDrivingDifficulty">
		<Select id="symptoms-nightDrivingDifficulty" label="Night-driving difficulty" bind:value={d.symptoms.nightDrivingDifficulty}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Faded colour perception" inputId="symptoms-fadedColourPerception">
		<Select id="symptoms-fadedColourPerception" label="Faded colour perception" bind:value={d.symptoms.fadedColourPerception}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Frequent prescription changes" inputId="symptoms-frequentPrescriptionChanges">
		<Select id="symptoms-frequentPrescriptionChanges" label="Frequent prescription changes" bind:value={d.symptoms.frequentPrescriptionChanges}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Symptom duration (months)" inputId="symptoms-symptomDurationMonths" description="Under 3 months with a severe LOCS III grade raises a rapid-progression flag.">
		<NumberInput id="symptoms-symptomDurationMonths" label="Symptom duration (months)" min={0} max={600} step="1" bind:value={d.symptoms.symptomDurationMonths} />
	</Field>
	<Field label="Symptom laterality" inputId="symptoms-symptomLaterality">
		<Select id="symptoms-symptomLaterality" label="Symptom laterality" bind:value={d.symptoms.symptomLaterality}>
			<option value="">— Select —</option>
			{#each OPTIONS.symptomLaterality as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Presenting complaint notes" inputId="symptoms-presentingComplaintNotes">
		<TextAreaInput id="symptoms-presentingComplaintNotes" label="Presenting complaint notes" rows={2} bind:value={d.symptoms.presentingComplaintNotes} />
	</Field>
</Fieldset>
