<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/result.svelte';

	const d = request.data.indication;
</script>

<Fieldset legend="4. Indication and Clinical Context">
	<p class="hint">The primary indication and the specific clinical question drive every other axis.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="cancer-staging">Cancer staging</option>
			<option value="inflammatory-disease">Inflammatory disease</option>
			<option value="infection">Infection</option>
			<option value="characterise-lesion">Characterise lesion</option>
			<option value="margin-assessment">Margin assessment</option>
			<option value="transplant-monitoring">Transplant monitoring</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the pathology report is asked to answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant clinical details" inputId="clinicalDetails">
		<TextAreaInput
			id="clinicalDetails"
			label="Relevant clinical details"
			rows={3}
			placeholder="Relevant clinical history and context for the pathologist…"
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Provisional diagnosis" inputId="provisionalDiagnosis">
		<TextInput id="provisionalDiagnosis" label="Provisional diagnosis" bind:value={d.provisionalDiagnosis} />
	</Field>

	<Field label="Previous histology" inputId="previousHistology">
		<TextAreaInput
			id="previousHistology"
			label="Previous histology"
			rows={2}
			placeholder="Any previous histology / relevant prior reports…"
			bind:value={d.previousHistology}
		/>
	</Field>
</Fieldset>
