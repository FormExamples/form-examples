<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.additionalInterventions.medications;
	const p = assessment.data.additionalInterventions.procedures;
</script>

<Fieldset
	title="Additional Interventions"
	description="Medications / fluids and procedures performed during the encounter, with times."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">Fluids and medications given</h3>
	<TextInput label="Time (24h)" name="medsTime" type="time" bind:value={m.time} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="IVF" name="ivfMls" bind:value={m.ivfMls} unit="mL" min={0} step={10} />
		<TextInput label="IVF type (NS / LR / Other)" name="ivfType" bind:value={m.ivfType} />
	</div>
	<TextInput label="Blood products (units)" name="bloodProductsUnits" bind:value={m.bloodProductsUnits} />
	<TextInput label="Opioid analgesia" name="opioidAnalgesia" bind:value={m.opioidAnalgesia} />
	<TextInput label="Other analgesia" name="otherAnalgesia" bind:value={m.otherAnalgesia} />
	<TextInput label="Sedation / paralytics" name="sedationParalytics" bind:value={m.sedationParalytics} />
	<TextInput label="Antimicrobials" name="antimicrobials" bind:value={m.antimicrobials} />
	<TextInput label="Tetanus" name="tetanus" bind:value={m.tetanus} />
	<TextInput label="Other medications" name="medsOther" bind:value={m.other} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Procedures</h3>
	<p class="mb-3 text-xs text-base-content/60">Record time and outcome for each procedure performed.</p>

	<h4 class="mt-2 mb-1 text-sm font-semibold text-base-content">Intubation</h4>
	<TextInput label="Time (24h)" name="intubationTime" type="time" bind:value={p.intubationTime} />
	<TextAreaInput label="Outcome" name="intubationOutcome" bind:value={p.intubationOutcome} rows={2} />

	<h4 class="mt-3 mb-1 text-sm font-semibold text-base-content">Chest tube</h4>
	<TextInput label="Time (24h)" name="chestTubeTime" type="time" bind:value={p.chestTubeTime} />
	<TextAreaInput label="Outcome" name="chestTubeOutcome" bind:value={p.chestTubeOutcome} rows={2} />

	<h4 class="mt-3 mb-1 text-sm font-semibold text-base-content">Lumbar puncture</h4>
	<TextInput label="Time (24h)" name="lumbarPunctureTime" type="time" bind:value={p.lumbarPunctureTime} />
	<TextAreaInput label="Outcome" name="lumbarPunctureOutcome" bind:value={p.lumbarPunctureOutcome} rows={2} />

	<h4 class="mt-3 mb-1 text-sm font-semibold text-base-content">Simple / complex laceration repair</h4>
	<TextInput label="Time (24h)" name="lacerationRepairTime" type="time" bind:value={p.lacerationRepairTime} />
	<TextAreaInput label="Outcome" name="lacerationRepairOutcome" bind:value={p.lacerationRepairOutcome} rows={2} />

	<TextAreaInput label="Other procedures" name="proceduresOther" bind:value={p.other} rows={3} />
</Fieldset>
