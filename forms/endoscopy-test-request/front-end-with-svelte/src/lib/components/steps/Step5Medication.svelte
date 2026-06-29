<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.medication;
</script>

<Fieldset legend="5. Medication">
	<p class="hint">Anticoagulant / antiplatelet therapy (BSG/ESGE), diabetes medication, and allergies.</p>

	<Field label="Anticoagulant">
		<CheckboxGroup label="Anticoagulant">
			<label>
				<CheckboxInput label="Taking an anticoagulant" bind:checked={d.takingAnticoagulant} />
				Taking an anticoagulant
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.takingAnticoagulant}
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<Select id="anticoagulantAgent" label="Anticoagulant agent" bind:value={d.anticoagulantAgent}>
				<option value="">Select…</option>
				<option value="warfarin">Warfarin</option>
				<option value="apixaban">Apixaban</option>
				<option value="rivaroxaban">Rivaroxaban</option>
				<option value="edoxaban">Edoxaban</option>
				<option value="dabigatran">Dabigatran</option>
				<option value="lmwh">Low-molecular-weight heparin</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Antiplatelet">
		<CheckboxGroup label="Antiplatelet">
			<label>
				<CheckboxInput label="Taking an antiplatelet" bind:checked={d.takingAntiplatelet} />
				Taking an antiplatelet
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.takingAntiplatelet}
		<Field label="Antiplatelet agent" inputId="antiplateletAgent">
			<Select id="antiplateletAgent" label="Antiplatelet agent" bind:value={d.antiplateletAgent}>
				<option value="">Select…</option>
				<option value="aspirin">Aspirin</option>
				<option value="clopidogrel">Clopidogrel</option>
				<option value="ticagrelor">Ticagrelor</option>
				<option value="prasugrel">Prasugrel</option>
				<option value="dual">Dual antiplatelet therapy</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Diabetes medication" inputId="diabetesMedication" description="e.g. insulin, GLP-1, SGLT2 — relevant to fasting / prep.">
		<TextInput id="diabetesMedication" label="Diabetes medication" bind:value={d.diabetesMedication} />
	</Field>

	<Field label="Allergies" inputId="allergies">
		<TextInput id="allergies" label="Allergies" placeholder="e.g. penicillin, sedatives" bind:value={d.allergies} />
	</Field>

	<Field label="Latex allergy">
		<CheckboxGroup label="Latex allergy">
			<label>
				<CheckboxInput label="Latex allergy" bind:checked={d.latexAllergy} />
				Latex allergy
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
