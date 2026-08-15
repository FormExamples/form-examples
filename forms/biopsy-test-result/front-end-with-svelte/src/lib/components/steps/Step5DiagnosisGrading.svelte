<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Diagnosis & Grading">
	<p class="hint">The definitive diagnosis, malignancy status, grade, margins, and ancillary tests.</p>

	<Field label="Diagnosis" inputId="diagnosis">
		<TextAreaInput
			id="diagnosis"
			label="Diagnosis"
			rows={4}
			placeholder="Definitive histopathological diagnosis (the body of the report)…"
			bind:value={d.diagnosis}
		/>
	</Field>

	<Field label="Malignancy and invasion">
		<CheckboxGroup label="Malignancy and invasion">
			<label><CheckboxInput label="Malignancy present" bind:checked={d.malignancyPresent} /> Malignancy present</label>
			<label><CheckboxInput label="Lymphovascular invasion" bind:checked={d.lymphovascularInvasion} /> Lymphovascular invasion</label>
		</CheckboxGroup>
	</Field>

	<Field label="Tumour type" inputId="tumourType">
		<TextInput
			id="tumourType"
			label="Tumour type"
			placeholder="e.g. invasive ductal carcinoma, squamous cell carcinoma"
			bind:value={d.tumourType}
		/>
	</Field>

	<Field label="Histological grade" inputId="histologicalGrade">
		<Select id="histologicalGrade" label="Histological grade" bind:value={d.histologicalGrade}>
			<option value="">Select…</option>
			<option value="well-differentiated">Well differentiated (G1)</option>
			<option value="moderately-differentiated">Moderately differentiated (G2)</option>
			<option value="poorly-differentiated">Poorly differentiated (G3)</option>
			<option value="undifferentiated">Undifferentiated (G4)</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Resection margins" inputId="resectionMargins">
		<Select id="resectionMargins" label="Resection margins" bind:value={d.resectionMargins}>
			<option value="">Select…</option>
			<option value="clear">Clear</option>
			<option value="involved">Involved</option>
			<option value="close">Close</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Immunohistochemistry" inputId="immunohistochemistry">
		<TextAreaInput
			id="immunohistochemistry"
			label="Immunohistochemistry"
			rows={3}
			placeholder="Immunohistochemistry panel results and interpretation…"
			bind:value={d.immunohistochemistry}
		/>
	</Field>

	<Field label="Molecular results" inputId="molecularResults">
		<TextAreaInput
			id="molecularResults"
			label="Molecular results"
			rows={3}
			placeholder="Molecular / genetic test results relevant to diagnosis or therapy…"
			bind:value={d.molecularResults}
		/>
	</Field>

	<Field label="SNOMED CT code" inputId="snomedCode">
		<TextInput
			id="snomedCode"
			label="SNOMED CT code"
			placeholder="SNOMED CT morphology / topography code"
			bind:value={d.snomedCode}
		/>
	</Field>

	{#if d.resectionMargins === 'involved' || (d.malignancyPresent && d.originatingRequestReference.trim() === '')}
		<Alert type="error" heading="Critical finding selected">
			<p>
				An involved resection margin or an unexpected malignancy auto-escalates the follow-up
				urgency to a critical alert and urgent MDT. Ensure the result is communicated to the
				referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
