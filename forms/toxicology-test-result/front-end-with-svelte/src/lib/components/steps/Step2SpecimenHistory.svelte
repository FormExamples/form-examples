<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen & History">
	<p class="hint">The specimen condition, clinical history, suspected agent, and timing.</p>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="insufficient">Insufficient</option>
			<option value="delayed">Delayed</option>
		</Select>
	</Field>

	<Field label="Suspected agent" inputId="suspectedAgent">
		<TextInput
			id="suspectedAgent"
			label="Suspected agent"
			placeholder="e.g. Paracetamol, lithium, carbon monoxide…"
			bind:value={d.suspectedAgent}
		/>
	</Field>

	<Field
		label="Time since ingestion (hours)"
		inputId="timeSinceIngestionHours"
		description="Required to interpret the paracetamol nomogram (only valid at ≥ 4 h)."
	>
		<NumberInput
			id="timeSinceIngestionHours"
			label="Time since ingestion (hours)"
			min={0}
			max={2000}
			step={0.1}
			bind:value={d.timeSinceIngestionHours}
		/>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the assay was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
