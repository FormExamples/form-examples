<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const d = assessment.data.request;

	const requestTypeOptions = [
		{ value: 'group-and-save', label: 'Group and save' },
		{ value: 'antibody-screen', label: 'Antibody screen' },
		{ value: 'crossmatch', label: 'Crossmatch' },
		{ value: 'emergency-o-negative', label: 'Emergency O-negative' },
		{ value: 'other', label: 'Other' }
	];
	const componentOptions = [
		{ value: 'red-cells', label: 'Red cells' },
		{ value: 'platelets', label: 'Platelets' },
		{ value: 'fresh-frozen-plasma', label: 'Fresh-frozen plasma' },
		{ value: 'cryoprecipitate', label: 'Cryoprecipitate' },
		{ value: 'none', label: 'None (sample only)' }
	];
</script>

<Fieldset legend="Step 3 of 7 · Requested test & component">
	<p class="hint">The requested test type, blood component, and timing.</p>

	<Field label="Request type" required inputId="request-requestType">
		<Select id="request-requestType" label="Request type" required bind:value={d.requestType}>
			<option value="">— Select —</option>
			{#each requestTypeOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Blood component" required inputId="request-component">
		<Select id="request-component" label="Blood component" required bind:value={d.component}>
			<option value="">— Select —</option>
			{#each componentOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Units required" description="units" inputId="request-unitsRequired">
		<NumberInput id="request-unitsRequired" label="Units required" min={0} max={50} bind:value={d.unitsRequired} />
	</Field>

	<div class="field-grid">
		<Field label="Requested-by date" inputId="request-requestedByDate">
			<DateInput id="request-requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
		</Field>
		<Field label="Required-by date & time" inputId="request-requiredByDatetime">
			<TextInput
				id="request-requiredByDatetime"
				label="Required-by date and time"
				type="datetime-local"
				bind:value={d.requiredByDatetime}
			/>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
