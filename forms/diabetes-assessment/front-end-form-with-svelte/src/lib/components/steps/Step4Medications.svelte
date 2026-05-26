<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import LikertGroup from '$lib/components/ui/LikertGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.medications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const adherenceOptions = [
		{ value: 1, label: 'Very Poor' },
		{ value: 2, label: 'Poor' },
		{ value: 3, label: 'Fair' },
		{ value: 4, label: 'Good' },
		{ value: 5, label: 'Excellent' }
	];
</script>

<Fieldset legend="Medications">
	<p class="hint">Record current diabetes medications and adherence.</p>

	<div class="field-grid">
		<Field label="Metformin">
			<RadioGroup label="Metformin">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="metformin" value={opt.value} bind:group={d.metformin} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Sulfonylurea" inputId="sulfonylurea">
			<Select id="sulfonylurea" label="Sulfonylurea" bind:value={d.sulfonylurea}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="previouslyUsed">Previously Used</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="SGLT2 Inhibitor" inputId="sglt2Inhibitor">
			<Select id="sglt2Inhibitor" label="SGLT2 Inhibitor" bind:value={d.sglt2Inhibitor}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="contraindicated">Contraindicated</option>
			</Select>
		</Field>
		<Field label="GLP-1 Receptor Agonist" inputId="glp1Agonist">
			<Select id="glp1Agonist" label="GLP-1 Receptor Agonist" bind:value={d.glp1Agonist}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="previouslyUsed">Previously Used</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="DPP-4 Inhibitor" inputId="dpp4Inhibitor">
			<Select id="dpp4Inhibitor" label="DPP-4 Inhibitor" bind:value={d.dpp4Inhibitor}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Insulin">
			<RadioGroup label="Insulin">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="insulin" value={opt.value} bind:group={d.insulin} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Insulin Regimen" inputId="insulinRegimen">
			<Select id="insulinRegimen" label="Insulin Regimen" bind:value={d.insulinRegimen}>
				<option value="">-- Select --</option>
				<option value="basalOnly">Basal Only</option>
				<option value="basalBolus">Basal-Bolus</option>
				<option value="mixedInsulin">Mixed Insulin</option>
				<option value="pump">Insulin Pump</option>
				<option value="notApplicable">Not Applicable</option>
			</Select>
		</Field>
		<Field label="Insulin Total Daily Dose (units)" inputId="insulinDailyDose">
			<NumberInput id="insulinDailyDose" label="Insulin Total Daily Dose" step={0.5} min={0} placeholder="e.g. 42" bind:value={d.insulinDailyDose} />
		</Field>
	</div>

	<Field label="Medication Adherence (self-reported)">
		<LikertGroup label="Medication Adherence" name="medicationAdherence" options={adherenceOptions} bind:value={d.medicationAdherence} />
	</Field>

	<Field label="Other Medications" inputId="otherMedications">
		<TextAreaInput id="otherMedications" label="Other Medications" rows={3} placeholder="List any other medications (non-diabetes)" bind:value={d.otherMedications} />
	</Field>
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
