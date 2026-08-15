<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const m = assessment.data.medicationsAndProcedures;
</script>

<Fieldset
	title="Medications & Procedures"
	description="Pre-printed medication categories, free-text medication entries, procedures performed and a procedure log (each row with time given and clinician initials)."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">Pre-printed medication categories</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="IVF" name="ivfMls" bind:value={m.ivfMls} unit="mL" min={0} step={10} />
		<TextInput label="IVF type (NS / LR / Other)" name="ivfType" bind:value={m.ivfType} />
	</div>
	<TextInput label="Blood (units)" name="bloodUnits" bind:value={m.bloodUnits} />
	<TextInput label="Analgesia" name="analgesia" bind:value={m.analgesia} />
	<TextInput label="Antimicrobials" name="antimicrobials" bind:value={m.antimicrobials} />
	<TextInput label="Tetanus" name="tetanus" bind:value={m.tetanus} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Medication entries (timed)</h3>
	{#each m.medications as _med, idx (idx)}
		<div class="mb-3 rounded-lg border border-base-300 bg-base-200 p-3">
			<h4 class="mb-2 text-sm font-semibold text-base-content/80">Medication {idx + 1}</h4>
			<TextInput label="Medication & dose" name={`med-${idx}-dose`} bind:value={m.medications[idx].medicationAndDose} />
			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput label="Time given (24h)" name={`med-${idx}-time`} type="time" bind:value={m.medications[idx].timeGiven} />
				<TextInput label="Initials" name={`med-${idx}-initials`} bind:value={m.medications[idx].initials} />
			</div>
		</div>
	{/each}

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Procedures performed</h3>
	<Checkbox label="Intubation" name="procIntubation" bind:checked={m.procIntubation} />
	<Checkbox label="Thoracostomy" name="procThoracostomy" bind:checked={m.procThoracostomy} />
	<Checkbox label="Splinting / reduction" name="procSplintingReduction" bind:checked={m.procSplintingReduction} />
	<Checkbox label="Laceration repair" name="procLacerationRepair" bind:checked={m.procLacerationRepair} />
	<TextInput label="Other procedures" name="procOther" bind:value={m.procOther} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Procedure entries (timed)</h3>
	{#each m.procedures as _proc, idx (idx)}
		<div class="mb-3 rounded-lg border border-base-300 bg-base-200 p-3">
			<h4 class="mb-2 text-sm font-semibold text-base-content/80">Procedure {idx + 1}</h4>
			<TextInput label="Procedure" name={`proc-${idx}-procedure`} bind:value={m.procedures[idx].procedure} />
			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput label="Time (24h)" name={`proc-${idx}-time`} type="time" bind:value={m.procedures[idx].timeGiven} />
				<TextInput label="Initials" name={`proc-${idx}-initials`} bind:value={m.procedures[idx].initials} />
			</div>
		</div>
	{/each}
</Fieldset>
