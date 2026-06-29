<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.symptomAssessment;
	const mmrcOptions = [
		{ value: '0', label: '0 - Breathless with strenuous exercise only' },
		{ value: '1', label: '1 - Short of breath when hurrying or walking up a slight hill' },
		{ value: '2', label: '2 - Walks slower than people of same age or stops for breath' },
		{ value: '3', label: '3 - Stops for breath after about 100 yards or a few minutes' },
		{ value: '4', label: '4 - Too breathless to leave the house or breathless when dressing' }
	];
	const coughOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'occasional', label: 'Occasional' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'persistent', label: 'Persistent throughout the day' }
	];
	const sputumOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'occasional', label: 'Occasional' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'copious', label: 'Copious / large amounts' }
	];

	const catImpact = $derived(
		s.catScore === null ? ''
		: s.catScore < 10 ? 'Low impact'
		: s.catScore < 20 ? 'Medium impact'
		: s.catScore < 30 ? 'High impact'
		: 'Very high impact'
	);
</script>

<Fieldset legend="Symptom Assessment">
	<p class="hint">COPD symptom severity evaluation.</p>

	<Field label="CAT Score (COPD Assessment Test)" inputId="catScore" description={catImpact}>
		<NumberInput id="catScore" label="CAT score" min={0} max={40} bind:value={s.catScore} />
	</Field>

	<Field label="mMRC Dyspnoea Scale" inputId="mmrc">
		<Select id="mmrc" label="mMRC dyspnoea" bind:value={s.mmrcDyspnoea}>
			<option value="">-- Select --</option>
			{#each mmrcOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Cough frequency" inputId="coughFreq">
		<Select id="coughFreq" label="Cough frequency" bind:value={s.coughFrequency}>
			<option value="">-- Select --</option>
			{#each coughOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Sputum production" inputId="sputum">
		<Select id="sputum" label="Sputum production" bind:value={s.sputumProduction}>
			<option value="">-- Select --</option>
			{#each sputumOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
</Fieldset>
