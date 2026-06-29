<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">Tracer / scan type, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested scan type / tracer" inputId="scanType" required>
		<Select id="scanType" label="Requested scan type / tracer" bind:value={d.scanType} required>
			<option value="">Select…</option>
			<option value="fdg-pet-ct">FDG-PET-CT ([18F]FDG)</option>
			<option value="psma-pet">PSMA-PET</option>
			<option value="dotatate-pet">DOTATATE-PET</option>
			<option value="amyloid-pet">Amyloid-PET</option>
			<option value="cardiac-pet">Cardiac-PET</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="cancer-staging">Cancer staging</option>
			<option value="cancer-restaging">Cancer restaging</option>
			<option value="treatment-response">Treatment response</option>
			<option value="suspected-recurrence">Suspected recurrence</option>
			<option value="solitary-pulmonary-nodule">Solitary pulmonary nodule</option>
			<option value="lymphoma">Lymphoma</option>
			<option value="cardiac-viability">Cardiac viability</option>
			<option value="infection-inflammation">Infection / inflammation</option>
			<option value="neurology-dementia">Neurology — dementia</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="e.g. Stage biopsy-proven NSCLC and assess for distant metastases."
			bind:value={d.clinicalQuestion}
		/>
	</Field>
</Fieldset>
