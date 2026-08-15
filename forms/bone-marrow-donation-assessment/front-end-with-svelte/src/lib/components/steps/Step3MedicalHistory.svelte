<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.medicalHistory;
</script>

<Fieldset legend="Medical History">
	<p class="hint">Past and current medical conditions relevant to donor safety.</p>

	<Field label="Autoimmune disease" inputId="hasAutoimmuneDisease">
		<Select id="hasAutoimmuneDisease" label="Autoimmune disease" bind:value={d.hasAutoimmuneDisease}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.hasAutoimmuneDisease === 'yes'}
		<Field label="Autoimmune details" inputId="autoimmuneDetails">
			<TextInput id="autoimmuneDetails" label="Autoimmune details" bind:value={d.autoimmuneDetails} />
		</Field>
	{/if}

	<Field label="History of malignancy" inputId="hasMalignancy">
		<Select id="hasMalignancy" label="History of malignancy" bind:value={d.hasMalignancy}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.hasMalignancy === 'yes'}
		<Field label="Malignancy details" inputId="malignancyDetails">
			<TextInput id="malignancyDetails" label="Malignancy details" bind:value={d.malignancyDetails} />
		</Field>
	{/if}

	<Field label="Cardiovascular disease" inputId="hasCardiovascularDisease">
		<Select id="hasCardiovascularDisease" label="Cardiovascular disease" bind:value={d.hasCardiovascularDisease}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Respiratory disease" inputId="hasRespiratoryDisease">
		<Select id="hasRespiratoryDisease" label="Respiratory disease" bind:value={d.hasRespiratoryDisease}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Renal disease" inputId="hasRenalDisease">
		<Select id="hasRenalDisease" label="Renal disease" bind:value={d.hasRenalDisease}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Hepatic disease" inputId="hasHepaticDisease">
		<Select id="hasHepaticDisease" label="Hepatic disease" bind:value={d.hasHepaticDisease}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Bleeding disorder" inputId="hasBleedingDisorder">
		<Select id="hasBleedingDisorder" label="Bleeding disorder" bind:value={d.hasBleedingDisorder}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Neurological condition" inputId="hasNeurologicalCondition">
		<Select id="hasNeurologicalCondition" label="Neurological condition" bind:value={d.hasNeurologicalCondition}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Current Medications" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current Medications" rows={2} bind:value={d.currentMedications} />
	</Field>

	<Field label="Drug Allergies" inputId="drugAllergies">
		<TextInput id="drugAllergies" label="Drug Allergies" bind:value={d.drugAllergies} />
	</Field>

	<Field label="Previous Surgery" inputId="previousSurgery">
		<Select id="previousSurgery" label="Previous Surgery" bind:value={d.previousSurgery}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.previousSurgery === 'yes'}
		<Field label="Surgery details" inputId="surgeryDetails">
			<TextInput id="surgeryDetails" label="Surgery details" bind:value={d.surgeryDetails} />
		</Field>
	{/if}
</Fieldset>
