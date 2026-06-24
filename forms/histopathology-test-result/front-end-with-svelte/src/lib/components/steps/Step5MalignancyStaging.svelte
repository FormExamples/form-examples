<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { hasUnexpectedMalignancy, hasInvolvedMargin } from '$lib/engine/utils';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Malignancy & Staging">
	<p class="hint">
		Malignancy and tumour characterisation: tumour type, histological grade, pathological TNM
		stage, resection margins, lymphovascular invasion, and ancillary coding.
	</p>

	<Field label="Malignancy">
		<CheckboxGroup label="Malignancy">
			<label>
				<CheckboxInput label="Malignancy present" bind:checked={d.malignancyPresent} /> Malignancy present
			</label>
			<label>
				<CheckboxInput label="Lymphovascular invasion" bind:checked={d.lymphovascularInvasion} /> Lymphovascular
				invasion
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Tumour type" inputId="tumourType">
		<TextInput
			id="tumourType"
			label="Tumour type"
			placeholder="e.g. invasive ductal carcinoma, adenocarcinoma"
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

	<Field label="Pathological pT" inputId="tnmPt" description="UICC/AJCC TNM 8th edition, e.g. pT1c.">
		<TextInput id="tnmPt" label="Pathological pT" placeholder="e.g. pT1c" bind:value={d.tnmPt} />
	</Field>

	<Field label="Pathological pN" inputId="tnmPn" description="e.g. pN0.">
		<TextInput id="tnmPn" label="Pathological pN" placeholder="e.g. pN0" bind:value={d.tnmPn} />
	</Field>

	<Field label="Pathological pM" inputId="tnmPm" description="e.g. pM0 / pM1.">
		<TextInput id="tnmPm" label="Pathological pM" placeholder="e.g. pM0" bind:value={d.tnmPm} />
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
			placeholder="Immunohistochemistry and other ancillary test results…"
			bind:value={d.immunohistochemistry}
		/>
	</Field>

	<Field label="SNOMED CT code" inputId="snomedCode">
		<TextInput
			id="snomedCode"
			label="SNOMED CT code"
			placeholder="SNOMED CT topography / morphology code(s)"
			bind:value={d.snomedCode}
		/>
	</Field>

	{#if hasUnexpectedMalignancy(d) || hasInvolvedMargin(d)}
		<Alert type="error" heading="Critical finding selected">
			<p>
				{#if hasUnexpectedMalignancy(d)}
					An unexpected malignancy (no linked originating request)
				{:else}
					An involved resection margin
				{/if}
				auto-escalates the follow-up urgency to a critical alert. Ensure the result is communicated
				to the requester on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
