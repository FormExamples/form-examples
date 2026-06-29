<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="5. Medication">
	<p class="hint">Anticoagulant / antiplatelet therapy drives the pre-procedure bleeding-risk axis.</p>

	<Field label="Anticoagulant therapy">
		<CheckboxGroup label="Anticoagulant therapy">
			<label><CheckboxInput label="Taking an anticoagulant" bind:checked={d.medication.takingAnticoagulant} /> Taking an anticoagulant (e.g. warfarin, DOAC)</label>
		</CheckboxGroup>
	</Field>

	{#if d.medication.takingAnticoagulant}
		<Alert type="warning" heading="High bleeding risk">
			<p>
				Anticoagulant therapy is a high bleeding risk for a high-risk lower-GI procedure. Plan
				periprocedural management per BSG / ESGE before booking.
			</p>
		</Alert>
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<TextInput id="anticoagulantAgent" label="Anticoagulant agent" placeholder="e.g. apixaban" bind:value={d.medication.anticoagulantAgent} />
		</Field>
	{/if}

	<Field label="Antiplatelet therapy">
		<CheckboxGroup label="Antiplatelet therapy">
			<label><CheckboxInput label="Taking an antiplatelet" bind:checked={d.medication.takingAntiplatelet} /> Taking an antiplatelet (e.g. clopidogrel, aspirin)</label>
		</CheckboxGroup>
	</Field>

	{#if d.medication.takingAntiplatelet}
		<Field label="Antiplatelet agent" inputId="antiplateletAgent">
			<TextInput id="antiplateletAgent" label="Antiplatelet agent" placeholder="e.g. clopidogrel" bind:value={d.medication.antiplateletAgent} />
		</Field>
	{/if}

	<Field label="Diabetes medication" inputId="diabetesMedication">
		<Select id="diabetesMedication" label="Diabetes medication" bind:value={d.medication.diabetesMedication}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="oral">Oral</option>
			<option value="insulin">Insulin</option>
		</Select>
	</Field>
</Fieldset>
