<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const s = assessment.data.socialHistory;
</script>

<Fieldset legend="Social History">
	<p class="hint">Lifestyle factors relevant to your health</p>
	<Field label="Smoking status" inputId="smoking"><Select id="smoking" label="Smoking status" bind:value={s.smokingStatus}><option value="">-- Select --</option>{#each [
			{ value: 'current', label: 'Current smoker' },
			{ value: 'ex', label: 'Ex-smoker' },
			{ value: 'never', label: 'Never smoked' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{#if s.smokingStatus === 'current' || s.smokingStatus === 'ex'}
		<NumberInput label="Pack years" name="packYears" bind:value={s.smokingPackYears} min={0} max={200} />
	{/if}

	<Field label="Alcohol consumption" inputId="alcohol"><Select id="alcohol" label="Alcohol consumption" bind:value={s.alcoholFrequency}><option value="">-- Select --</option>{#each [
			{ value: 'none', label: 'None' },
			{ value: 'occasional', label: 'Occasional (1-7 units/week)' },
			{ value: 'moderate', label: 'Moderate (8-14 units/week)' },
			{ value: 'heavy', label: 'Heavy (>14 units/week)' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{#if s.alcoholFrequency && s.alcoholFrequency !== 'none'}
		<NumberInput label="Units per week" name="alcoholUnits" bind:value={s.alcoholUnitsPerWeek} min={0} max={200} />
	{/if}

	<Field label="Recreational drug use" inputId="drugUse"><Select id="drugUse" label="Recreational drug use" bind:value={s.drugUse}><option value="">-- Select --</option>{#each [
			{ value: 'none', label: 'None' },
			{ value: 'occasional', label: 'Occasional' },
			{ value: 'regular', label: 'Regular' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{#if s.drugUse !== '' && s.drugUse !== 'none'}
		<Field label="Please provide details (substance, frequency)" inputId="drugDetails"><TextInput id="drugDetails" label="Please provide details (substance, frequency)" bind:value={s.drugDetails} /></Field>
	{/if}

	<Field label="Occupation" inputId="occupation"><TextInput id="occupation" label="Occupation" bind:value={s.occupation} /></Field>

	<Field label="Exercise frequency" inputId="exercise"><Select id="exercise" label="Exercise frequency" bind:value={s.exerciseFrequency}><option value="">-- Select --</option>{#each [
			{ value: 'none', label: 'None' },
			{ value: 'occasional', label: 'Occasional (1-2 times/week)' },
			{ value: 'moderate', label: 'Moderate (3-4 times/week)' },
			{ value: 'regular', label: 'Regular (5+ times/week)' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Diet quality" inputId="diet"><Select id="diet" label="Diet quality" bind:value={s.dietQuality}><option value="">-- Select --</option>{#each [
			{ value: 'poor', label: 'Poor' },
			{ value: 'average', label: 'Average' },
			{ value: 'good', label: 'Good' },
			{ value: 'excellent', label: 'Excellent' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
</Fieldset>
