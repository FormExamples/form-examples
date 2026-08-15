<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">
		Specimen type, site, indication, and the specific clinical question — the highest-value fields
		for vetting.
	</p>

	<Field label="Requested specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Requested specimen type" bind:value={d.request.specimenType} required>
			<option value="">Select…</option>
			<option value="cervical-smear">Cervical smear</option>
			<option value="urine-cytology">Urine cytology</option>
			<option value="sputum-cytology">Sputum cytology</option>
			<option value="fluid-pleural-ascitic">Fluid — pleural / ascitic</option>
			<option value="fine-needle-aspiration-thyroid">FNA — thyroid</option>
			<option value="fine-needle-aspiration-breast">FNA — breast</option>
			<option value="csf-cytology">CSF cytology</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen site / source" inputId="specimenSite">
		<TextInput
			id="specimenSite"
			label="Specimen site / source"
			placeholder="e.g. cervix, right pleural cavity, left thyroid lobe"
			bind:value={d.request.specimenSite}
		/>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.request.primaryIndication} required>
			<option value="">Select…</option>
			<option value="cervical-screening">Cervical screening</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="haematuria">Haematuria</option>
			<option value="effusion-investigation">Effusion investigation</option>
			<option value="thyroid-nodule">Thyroid nodule</option>
			<option value="breast-lump">Breast lump</option>
			<option value="follow-up">Follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Exclude malignant cells in pleural effusion."
			bind:value={d.request.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant clinical details" inputId="clinicalDetails">
		<TextAreaInput
			id="clinicalDetails"
			label="Relevant clinical details"
			rows={3}
			placeholder="History, prior imaging, prior results."
			bind:value={d.request.clinicalDetails}
		/>
	</Field>
</Fieldset>
