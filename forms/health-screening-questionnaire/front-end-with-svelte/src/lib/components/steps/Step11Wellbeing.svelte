<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { SCALE_0_TO_4, YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;

	// The native <select> value is a string; the model stores a number.
	let stressLevelProxy = $state(d.wellbeing.stressLevel === null ? '' : String(d.wellbeing.stressLevel));
	$effect(() => {
		d.wellbeing.stressLevel = stressLevelProxy === '' ? null : Number(stressLevelProxy);
	});
	let sleepQualityProxy = $state(d.wellbeing.sleepQuality === null ? '' : String(d.wellbeing.sleepQuality));
	$effect(() => {
		d.wellbeing.sleepQuality = sleepQualityProxy === '' ? null : Number(sleepQualityProxy);
	});
</script>

<Fieldset legend="11. Mental Health and Wellbeing Check">
	<p class="hint">
		Light-touch only — this monorepo has dedicated mental-health assessment forms for a full
		evaluation.
	</p>

	<Field label="Stress level (0 none — 4 severe)" inputId="wellbeing-stressLevel">
		<Select id="wellbeing-stressLevel" label="Stress level (0 none — 4 severe)" bind:value={stressLevelProxy}>
			<option value="">— Select —</option>
			{#each SCALE_0_TO_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Sleep quality (0 very poor — 4 very good)" inputId="wellbeing-sleepQuality">
		<Select id="wellbeing-sleepQuality" label="Sleep quality (0 very poor — 4 very good)" bind:value={sleepQualityProxy}>
			<option value="">— Select —</option>
			{#each SCALE_0_TO_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Any current mental-health concern" inputId="wellbeing-mentalHealthConcern">
		<Select id="wellbeing-mentalHealthConcern" label="Any current mental-health concern" bind:value={d.wellbeing.mentalHealthConcern}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.wellbeing.mentalHealthConcern === 'yes'}
		<Field label="Note" inputId="wellbeing-mentalHealthConcernNote">
			<TextAreaInput id="wellbeing-mentalHealthConcernNote" label="Note" rows={2} bind:value={d.wellbeing.mentalHealthConcernNote} />
		</Field>
	{/if}
</Fieldset>
