<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { isFdgStudy } from '#lib/engine/utils.js';

	const d = request.data.preparation;
	const fdg = $derived(isFdgStudy(request.data.request.scanType));
</script>

<Fieldset legend="5. Preparation and Safety">
	<p class="hint">
		Diabetes, blood glucose, pregnancy, breastfeeding, and renal function drive the
		preparation-safety axis.
	</p>

	<Field label="Diabetes">
		<CheckboxGroup label="Diabetes">
			<label><CheckboxInput label="Diabetes" bind:checked={d.diabetes} /> Diabetes</label>
		</CheckboxGroup>
	</Field>

	<Field label="Blood glucose (mmol/L)" inputId="bloodGlucoseMmolL" description="FDG uptake needs glucose typically below ~11 mmol/L.">
		<NumberInput
			id="bloodGlucoseMmolL"
			label="Blood glucose (mmol/L)"
			min={0}
			max={60}
			step={0.1}
			bind:value={d.bloodGlucoseMmolL}
		/>
	</Field>

	{#if fdg && (d.bloodGlucoseMmolL === null || d.bloodGlucoseMmolL === undefined)}
		<Alert type="warning" heading="Glucose required for an FDG study">
			<p>No blood glucose recorded. Measure and document it before tracer injection.</p>
		</Alert>
	{:else if fdg && d.bloodGlucoseMmolL !== null && d.bloodGlucoseMmolL > 11}
		<Alert type="warning" heading="Glucose above ~11 mmol/L">
			<p>Recheck and reschedule; impaired FDG uptake will degrade the study.</p>
		</Alert>
	{/if}

	<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
		<NumberInput id="egfr" label="eGFR (mL/min/1.73m²)" min={0} max={200} step={0.1} bind:value={d.egfr} />
	</Field>

	<Field label="Pregnancy status" inputId="pregnancyStatus">
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus}>
			<option value="">Select…</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="pregnant">Pregnant</option>
			<option value="possible">Possible</option>
			<option value="unknown">Unknown</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if d.pregnancyStatus === 'pregnant'}
		<Alert type="error" heading="Pregnancy — contraindicated">
			<p>
				PET-CT radiation exposure is contraindicated in pregnancy unless justified by exception.
				Discuss alternatives with the nuclear-medicine physician and ARSAC holder.
			</p>
		</Alert>
	{:else if d.pregnancyStatus === 'possible'}
		<Alert type="warning" heading="Pregnancy possible">
			<p>Confirm pregnancy status (e.g. beta-hCG / LMP) before tracer administration.</p>
		</Alert>
	{/if}

	<Field label="Safety">
		<CheckboxGroup label="Safety">
			<label><CheckboxInput label="Breastfeeding" bind:checked={d.breastfeeding} /> Breastfeeding</label>
			<label><CheckboxInput label="Claustrophobia" bind:checked={d.claustrophobia} /> Claustrophobia</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
