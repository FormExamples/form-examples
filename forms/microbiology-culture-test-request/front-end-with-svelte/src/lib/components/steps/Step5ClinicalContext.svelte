<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.clinical;
</script>

<Fieldset legend="5. Clinical Context">
	<p class="hint">The primary indication and clinical details — the highest-value fields for laboratory interpretation and triage.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-sepsis">Suspected sepsis</option>
			<option value="urinary-tract-infection">Urinary-tract infection</option>
			<option value="wound-infection">Wound infection</option>
			<option value="respiratory-infection">Respiratory infection</option>
			<option value="gastroenteritis">Gastroenteritis</option>
			<option value="meningitis">Meningitis</option>
			<option value="sti-screen">STI screen</option>
			<option value="pyrexia-unknown-origin">Pyrexia of unknown origin</option>
			<option value="infection-screening">Infection screening</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="Presentation, duration, relevant history, and the question for the laboratory…"
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Clinical factors">
		<CheckboxGroup label="Clinical factors">
			<label><CheckboxInput label="Fever" bind:checked={d.fever} /> Fever</label>
			<label><CheckboxInput label="Currently on antibiotics" bind:checked={d.currentAntibiotics} /> Currently on antibiotics</label>
			<label><CheckboxInput label="Recent travel" bind:checked={d.recentTravel} /> Recent travel</label>
			<label><CheckboxInput label="Immunocompromised" bind:checked={d.immunocompromised} /> Immunocompromised</label>
		</CheckboxGroup>
	</Field>

	{#if d.currentAntibiotics}
		<Field label="Antibiotic name" inputId="antibioticName" description="Which antibiotic(s) the patient is currently taking.">
			<TextInput
				id="antibioticName"
				label="Antibiotic name"
				placeholder="e.g. co-amoxiclav"
				bind:value={d.antibioticName}
			/>
		</Field>
	{/if}
</Fieldset>
