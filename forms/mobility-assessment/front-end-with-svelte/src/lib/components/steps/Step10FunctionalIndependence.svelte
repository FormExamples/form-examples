<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const fi = assessment.data.functionalIndependence;

	const independenceLevels = [
		{ value: 'independent', label: 'Independent' },
		{ value: 'modified-independent', label: 'Modified Independent (device)' },
		{ value: 'supervision', label: 'Supervision' },
		{ value: 'minimal-assist', label: 'Minimal Assistance (25%)' },
		{ value: 'moderate-assist', label: 'Moderate Assistance (50%)' },
		{ value: 'maximal-assist', label: 'Maximal Assistance (75%)' },
		{ value: 'dependent', label: 'Dependent (100%)' }
	];
</script>

<Fieldset legend="Functional Independence">
	<p class="hint">Assess level of independence in daily mobility tasks.</p>

	<Field label="Transfers (bed, chair, toilet)" inputId="transfers">
		<Select id="transfers" label="Transfers" bind:value={fi.transfers}>
			<option value="">-- Select --</option>
			{#each independenceLevels as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Ambulation" inputId="ambulation">
		<Select id="ambulation" label="Ambulation" bind:value={fi.ambulation}>
			<option value="">-- Select --</option>
			{#each independenceLevels as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Stairs" inputId="stairs">
		<Select id="stairs" label="Stairs" bind:value={fi.stairs}>
			<option value="">-- Select --</option>
			{#each independenceLevels as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Bathing" inputId="bathing">
		<Select id="bathing" label="Bathing" bind:value={fi.bathing}>
			<option value="">-- Select --</option>
			{#each independenceLevels as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Dressing (lower body)" inputId="dressing">
		<Select id="dressing" label="Dressing" bind:value={fi.dressing}>
			<option value="">-- Select --</option>
			{#each independenceLevels as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Additional Notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional Notes" rows={3} placeholder="Any additional observations about functional independence..." bind:value={fi.additionalNotes} />
	</Field>
</Fieldset>
