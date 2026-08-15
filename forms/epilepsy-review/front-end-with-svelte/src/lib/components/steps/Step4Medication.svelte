<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Step 4 of 11 — Anti-seizure medication">
	<p class="hint">Current ASM(s), adherence, tolerability, and therapeutic level.</p>

	<Field label="Current ASM(s) and doses" inputId="medication-currentAsms">
		<TextAreaInput
			id="medication-currentAsms"
			label="Current ASM(s) and doses"
			rows={3}
			placeholder="e.g. lamotrigine 200 mg BD; levetiracetam 1 g BD."
			bind:value={m.currentAsms}
		/>
	</Field>

	<Field
		label="Adherence"
		description="Poor raises a poor-adherence flag."
		inputId="medication-asmAdherence"
	>
		<Select id="medication-asmAdherence" label="Adherence" bind:value={m.asmAdherence}>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field
		label="Side effects"
		description="Significant raises an ASM-side-effects flag."
		inputId="medication-asmSideEffects"
	>
		<Select id="medication-asmSideEffects" label="Side effects" bind:value={m.asmSideEffects}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="significant">Significant</option>
		</Select>
	</Field>

	<Field label="Therapeutic drug level (where relevant)" inputId="medication-drugLevel">
		<NumberInput
			id="medication-drugLevel"
			label="Therapeutic drug level (where relevant)"
			min={0}
			max={300}
			step={0.1}
			placeholder="e.g. 12.5 (phenytoin)"
			bind:value={m.drugLevel}
		/>
	</Field>
</Fieldset>
