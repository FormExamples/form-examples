<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const e = assessment.data.endocrine;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Endocrine">
	<p class="hint">Hormonal conditions</p>
	<Field label="Do you have diabetes?" inputId="diabetes"><Select id="diabetes" label="Do you have diabetes?" bind:value={e.diabetes}><option value="">-- Select --</option>{#each [
			{ value: 'none', label: 'No' },
			{ value: 'type1', label: 'Type 1' },
			{ value: 'type2', label: 'Type 2' },
			{ value: 'gestational', label: 'Gestational' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{#if e.diabetes && e.diabetes !== 'none'}
		<Field label="How well controlled is your diabetes?" required inputId="diabetesCtrl"><Select id="diabetesCtrl" label="How well controlled is your diabetes?" required bind:value={e.diabetesControl}><option value="">-- Select --</option>{#each [
				{ value: 'well-controlled', label: 'Well controlled' },
				{ value: 'poorly-controlled', label: 'Poorly controlled' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Are you on insulin?"><RadioGroup label="Are you on insulin?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="insulin" value={opt.value} bind:group={e.diabetesOnInsulin}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you have thyroid disease?"><RadioGroup label="Do you have thyroid disease?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="thyroid" value={opt.value} bind:group={e.thyroidDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if e.thyroidDisease === 'yes'}
		<Field label="Thyroid condition" required inputId="thyroidType"><Select id="thyroidType" label="Thyroid condition" required bind:value={e.thyroidType}><option value="">-- Select --</option>{#each [
				{ value: 'hypothyroid', label: 'Underactive (hypothyroid)' },
				{ value: 'hyperthyroid', label: 'Overactive (hyperthyroid)' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Do you have adrenal insufficiency?"><RadioGroup label="Do you have adrenal insufficiency?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="adrenal" value={opt.value} bind:group={e.adrenalInsufficiency}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
