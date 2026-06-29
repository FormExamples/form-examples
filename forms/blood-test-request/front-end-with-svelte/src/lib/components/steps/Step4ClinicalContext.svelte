<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.clinical;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">The primary indication, clinical details, and relevant medications.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="routine-monitoring">Routine monitoring</option>
			<option value="anaemia">Anaemia</option>
			<option value="fatigue">Fatigue</option>
			<option value="infection">Infection</option>
			<option value="diabetes-monitoring">Diabetes monitoring</option>
			<option value="thyroid-symptoms">Thyroid symptoms</option>
			<option value="cardiovascular-risk">Cardiovascular risk</option>
			<option value="liver-disease">Liver disease</option>
			<option value="renal-monitoring">Renal monitoring</option>
			<option value="anticoagulation-monitoring">Anticoagulation monitoring</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required description="The clinical details the laboratory needs to interpret the result.">
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="e.g. Annual review of long-term condition; stable on treatment…"
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Relevant medications" inputId="relevantMedications">
		<TextAreaInput
			id="relevantMedications"
			label="Relevant medications"
			rows={2}
			placeholder="e.g. Ramipril 5 mg OD, atorvastatin 20 mg ON…"
			bind:value={d.relevantMedications}
		/>
	</Field>
</Fieldset>
