<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen & Context">
	<p class="hint">Pre-analytical specimen condition, clinical history, and anticoagulant status.</p>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="clotted">Clotted</option>
			<option value="underfilled">Underfilled</option>
			<option value="haemolysed">Haemolysed</option>
			<option value="insufficient">Insufficient</option>
		</Select>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the test was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>

	<Field label="Anticoagulant status">
		<CheckboxGroup label="Anticoagulant status">
			<label>
				<CheckboxInput label="Patient on anticoagulant therapy" bind:checked={d.onAnticoagulant} />
				Patient on anticoagulant therapy
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.onAnticoagulant}
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<TextInput
				id="anticoagulantAgent"
				label="Anticoagulant agent"
				placeholder="e.g. warfarin, LMWH, apixaban, rivaroxaban, dabigatran"
				bind:value={d.anticoagulantAgent}
			/>
		</Field>
	{/if}
</Fieldset>
