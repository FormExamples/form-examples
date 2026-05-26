<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const d = assessment.data.complicationsScreening;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Complications Screening">
	<p class="hint">Record diabetes-related complications and screening results.</p>

	<div class="field-grid">
		<Field label="Retinopathy Status" inputId="retinopathyStatus">
			<Select id="retinopathyStatus" label="Retinopathy Status" bind:value={d.retinopathyStatus}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="background">Background</option>
				<option value="preProliferative">Pre-Proliferative</option>
				<option value="proliferative">Proliferative</option>
				<option value="maculopathy">Maculopathy</option>
			</Select>
		</Field>
		<Field label="Last Eye Screening Date" inputId="lastEyeScreening">
			<DateInput id="lastEyeScreening" label="Last Eye Screening Date" bind:value={d.lastEyeScreening} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Nephropathy Status" inputId="nephropathyStatus">
			<Select id="nephropathyStatus" label="Nephropathy Status" bind:value={d.nephropathyStatus}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="microalbuminuria">Microalbuminuria</option>
				<option value="macroalbuminuria">Macroalbuminuria</option>
				<option value="ckd">Chronic Kidney Disease</option>
			</Select>
		</Field>
		<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR" step={0.1} min={0} placeholder="e.g. 90" bind:value={d.egfr} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Urine ACR (mg/mmol)" inputId="urineAcr">
			<NumberInput id="urineAcr" label="Urine ACR" step={0.1} min={0} placeholder="e.g. 2.5" bind:value={d.urineAcr} />
		</Field>
		<Field label="Neuropathy Symptoms">
			<RadioGroup label="Neuropathy Symptoms">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="neuropathySymptoms" value={opt.value} bind:group={d.neuropathySymptoms} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Autonomic Neuropathy" inputId="autonomicNeuropathy">
			<Select id="autonomicNeuropathy" label="Autonomic Neuropathy" bind:value={d.autonomicNeuropathy}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="suspected">Suspected</option>
				<option value="confirmed">Confirmed</option>
			</Select>
		</Field>
		<Field label="Erectile Dysfunction" inputId="erectileDysfunction">
			<Select id="erectileDysfunction" label="Erectile Dysfunction" bind:value={d.erectileDysfunction}>
				<option value="">-- Select --</option>
				<option value="notApplicable">Not Applicable</option>
				<option value="no">No</option>
				<option value="yes">Yes</option>
			</Select>
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
