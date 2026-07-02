<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Step 6 of 12 — Medication and adherence">
	<p class="hint">Antihypertensive burden, adherence, and tolerability.</p>

	<Field label="Number of antihypertensive agents" inputId="medication-antihypertensiveAgents">
		<NumberInput
			id="medication-antihypertensiveAgents"
			label="Number of antihypertensive agents"
			min={0}
			max={10}
			step={1}
			placeholder="e.g. 2"
			bind:value={m.antihypertensiveAgents}
		/>
	</Field>

	<Field
		label="Adherence"
		description="Poor raises an adherence-concern flag."
		inputId="medication-adherence"
	>
		<Select id="medication-adherence" label="Adherence" bind:value={m.adherence}>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field
		label="Troublesome side effects"
		description="Yes raises an adherence-concern flag."
		inputId="medication-sideEffects"
	>
		<Select id="medication-sideEffects" label="Troublesome side effects" bind:value={m.sideEffects}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
