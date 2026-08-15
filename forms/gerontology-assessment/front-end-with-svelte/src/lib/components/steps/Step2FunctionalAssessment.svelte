<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const f = assessment.data.functionalAssessment;

	const adlOptions = [
		{ value: 'independent', label: 'Independent' },
		{ value: 'needs-assistance', label: 'Needs Assistance' },
		{ value: 'dependent', label: 'Dependent' }
	];

	const bADLs: { key: keyof typeof f; label: string; id: string }[] = [
		{ key: 'bathingADL', label: 'Bathing', id: 'bathingADL' },
		{ key: 'dressingADL', label: 'Dressing', id: 'dressingADL' },
		{ key: 'toiletingADL', label: 'Toileting', id: 'toiletingADL' },
		{ key: 'transferringADL', label: 'Transferring', id: 'transferringADL' },
		{ key: 'feedingADL', label: 'Feeding', id: 'feedingADL' }
	];

	const iADLs: { key: keyof typeof f; label: string; id: string }[] = [
		{ key: 'cookingIADL', label: 'Cooking', id: 'cookingIADL' },
		{ key: 'cleaningIADL', label: 'Cleaning', id: 'cleaningIADL' },
		{ key: 'shoppingIADL', label: 'Shopping', id: 'shoppingIADL' },
		{ key: 'financesIADL', label: 'Managing Finances', id: 'financesIADL' },
		{ key: 'medicationManagementIADL', label: 'Medication Management', id: 'medicationManagementIADL' }
	];
</script>

<Fieldset legend="Functional Assessment">
	<p class="hint">Activities of Daily Living (ADLs) and Instrumental Activities of Daily Living (IADLs).</p>

	<h3 class="subhead">Basic ADLs</h3>
	{#each bADLs as item (item.key)}
		<Field label={item.label} required inputId={item.id}>
			<Select id={item.id} label={item.label} required bind:value={f[item.key]}>
				<option value="">-- Select --</option>
				{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	{/each}

	<h3 class="subhead">Instrumental ADLs</h3>
	{#each iADLs as item (item.key)}
		<Field label={item.label} required inputId={item.id}>
			<Select id={item.id} label={item.label} required bind:value={f[item.key]}>
				<option value="">-- Select --</option>
				{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	{/each}
</Fieldset>

<style>
	.subhead { font-size: 0.875rem; font-weight: 600; color: var(--color-text); margin: 1rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
</style>
