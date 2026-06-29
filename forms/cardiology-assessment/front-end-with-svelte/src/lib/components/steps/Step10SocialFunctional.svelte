<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { estimateMETs } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const s = assessment.data.socialFunctional;

	$effect(() => {
		const mets = estimateMETs(s.exerciseTolerance);
		assessment.data.socialFunctional.estimatedMETs = mets;
	});
</script>

<Fieldset legend="Social & Functional">
	<p class="hint">Smoking, alcohol, exercise tolerance, and occupation.</p>

	<Field label="Smoking status" inputId="smoking">
		<Select id="smoking" label="Smoking status" bind:value={s.smoking}>
			<option value="">-- Select --</option>
			<option value="current">Current smoker</option>
			<option value="ex">Ex-smoker</option>
			<option value="never">Never smoked</option>
		</Select>
	</Field>
	{#if s.smoking === 'current' || s.smoking === 'ex'}
		<Field label="Pack years" inputId="packYears">
			<NumberInput id="packYears" label="Pack years" min={0} max={200} bind:value={s.smokingPackYears} />
		</Field>
	{/if}

	<Field label="Alcohol consumption" inputId="alcohol">
		<Select id="alcohol" label="Alcohol consumption" bind:value={s.alcohol}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional (1-7 units/week)</option>
			<option value="moderate">Moderate (8-14 units/week)</option>
			<option value="heavy">Heavy (&gt;14 units/week)</option>
		</Select>
	</Field>
	{#if s.alcohol !== 'none' && s.alcohol !== ''}
		<Field label="Units per week" inputId="alcoholUnits">
			<NumberInput id="alcoholUnits" label="Units per week" min={0} max={200} bind:value={s.alcoholUnitsPerWeek} />
		</Field>
	{/if}

	<Field label="Exercise tolerance" inputId="exerciseTolerance">
		<Select id="exerciseTolerance" label="Exercise tolerance" bind:value={s.exerciseTolerance}>
			<option value="">-- Select --</option>
			<option value="unable">Unable to exercise</option>
			<option value="light-housework">Light housework only</option>
			<option value="climb-stairs">Can climb 1-2 flights of stairs</option>
			<option value="moderate-exercise">Moderate exercise (brisk walking)</option>
			<option value="vigorous-exercise">Vigorous exercise (running, swimming)</option>
		</Select>
	</Field>

	{#if s.estimatedMETs !== null}
		<Field label="Estimated METs" description={s.estimatedMETs < 4 ? 'Poor — below 4 METs threshold' : 'Adequate'}>
			<p class="mets-value">{s.estimatedMETs} METs</p>
		</Field>
	{/if}

	<Field label="Occupation" inputId="occupation">
		<TextInput id="occupation" label="Occupation" placeholder="e.g. Retired, office worker, manual labour" bind:value={s.occupation} />
	</Field>
</Fieldset>

<style>
	.mets-value {
		margin: 0;
		font-weight: 500;
	}
</style>
