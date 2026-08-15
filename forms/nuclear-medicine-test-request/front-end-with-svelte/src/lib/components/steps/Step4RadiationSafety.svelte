<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = request.data.safety;

	const pregnancyOptions = [
		{ value: 'not-applicable', label: 'Not applicable' },
		{ value: 'not-pregnant', label: 'Not pregnant' },
		{ value: 'possible', label: 'Possible' },
		{ value: 'pregnant', label: 'Pregnant' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Radiation safety">
	<p class="hint">
		Pregnancy, breastfeeding, renal function, and recent radionuclide exposure drive the preparation
		&amp; radiation-safety band.
	</p>

	<Field label="Pregnancy status" required inputId="pregnancyStatus">
		<Select id="pregnancyStatus" label="Pregnancy status" required bind:value={d.pregnancyStatus}>
			<option value="">— Select —</option>
			{#each pregnancyOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
		<NumberInput id="egfr" label="eGFR" min={0} max={200} step={0.1} bind:value={d.egfr} />
	</Field>

	<h3 class="subhead">Radiation-safety checks</h3>
	<label class="checkbox-row">
		<CheckboxInput id="breastfeeding" label="Currently breastfeeding" bind:checked={d.breastfeeding} />
		Currently breastfeeding
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="recentOtherNuclearScan" label="Recent other radionuclide study" bind:checked={d.recentOtherNuclearScan} />
		Recent other radionuclide study
	</label>
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.15rem 0;
	}
</style>
