<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Step 6 of 8 — Medication review">
	<p class="hint">RAAS blockade, SGLT2 inhibitor, statin, and the nephrotoxin check.</p>

	<Field label="ACEi / ARB prescribed" inputId="medication-aceiOrArbPrescribed">
		<Select id="medication-aceiOrArbPrescribed" label="ACEi / ARB prescribed" bind:value={m.aceiOrArbPrescribed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="contraindicated">Contraindicated</option>
		</Select>
	</Field>

	<Field label="SGLT2 inhibitor prescribed" inputId="medication-sglt2iPrescribed">
		<Select id="medication-sglt2iPrescribed" label="SGLT2 inhibitor prescribed" bind:value={m.sglt2iPrescribed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-indicated">Not indicated</option>
		</Select>
	</Field>

	<Field label="Statin prescribed" inputId="medication-statinPrescribed">
		<Select id="medication-statinPrescribed" label="Statin prescribed" bind:value={m.statinPrescribed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="declined">Declined</option>
		</Select>
	</Field>

	<Field
		label="Nephrotoxic drug present"
		description="e.g. NSAID or a renally-cleared agent."
		inputId="medication-nephrotoxicDrugPresent"
	>
		<Select id="medication-nephrotoxicDrugPresent" label="Nephrotoxic drug present" bind:value={m.nephrotoxicDrugPresent}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Nephrotoxic drug dose-adjusted or held"
		description="A present nephrotoxin not adjusted raises a high-priority flag."
		inputId="medication-nephrotoxicDoseAdjusted"
	>
		<Select id="medication-nephrotoxicDoseAdjusted" label="Nephrotoxic drug dose-adjusted or held" bind:value={m.nephrotoxicDoseAdjusted}>
			<option value="">— Select —</option>
			<option value="yes">Yes — dose-adjusted or held</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Structured medication review completed" inputId="medication-medicationReviewCompleted">
		<Select id="medication-medicationReviewCompleted" label="Structured medication review completed" bind:value={m.medicationReviewCompleted}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
