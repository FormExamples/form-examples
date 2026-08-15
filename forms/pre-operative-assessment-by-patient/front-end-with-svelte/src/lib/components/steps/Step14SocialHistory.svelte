<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const s = assessment.data.socialHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Social History">
	<p class="hint">Lifestyle factors relevant to anaesthesia</p>
	<Field label="Alcohol consumption" inputId="alcohol"><Select id="alcohol" label="Alcohol consumption" bind:value={s.alcohol}><option value="">-- Select --</option>{#each [
			{ value: 'none', label: 'None' },
			{ value: 'occasional', label: 'Occasional (1-7 units/week)' },
			{ value: 'moderate', label: 'Moderate (8-14 units/week)' },
			{ value: 'heavy', label: 'Heavy (>14 units/week)' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{#if s.alcohol && s.alcohol !== 'none'}
		<NumberInput label="Units per week" name="alcoholUnits" bind:value={s.alcoholUnitsPerWeek} min={0} max={200} />
	{/if}

	<Field label="Do you use recreational drugs?"><RadioGroup label="Do you use recreational drugs?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="drugs" value={opt.value} bind:group={s.recreationalDrugs}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if s.recreationalDrugs === 'yes'}
		<Field label="Please provide details (substance, frequency)" inputId="drugDetails"><TextInput id="drugDetails" label="Please provide details (substance, frequency)" bind:value={s.drugDetails} /></Field>
	{/if}

	<Field label="Do you give blood?"><RadioGroup label="Do you give blood?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="bloodDonor" value={opt.value} bind:group={s.bloodDonor}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have any body piercings?"><RadioGroup label="Do you have any body piercings?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="piercings" value={opt.value} bind:group={s.bodyPiercings}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
