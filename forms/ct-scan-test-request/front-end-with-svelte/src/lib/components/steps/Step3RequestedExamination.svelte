<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">Body region, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Requested body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="head">Head</option>
			<option value="neck">Neck</option>
			<option value="chest">Chest</option>
			<option value="abdomen">Abdomen</option>
			<option value="pelvis">Pelvis</option>
			<option value="abdomen-pelvis">Abdomen / pelvis</option>
			<option value="spine">Spine</option>
			<option value="ct-angiogram">CT angiogram</option>
			<option value="ct-colonography">CT colonography</option>
			<option value="whole-body">Whole body</option>
			<option value="extremity">Extremity</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="trauma">Trauma</option>
			<option value="suspected-stroke">Suspected stroke</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="cancer-staging">Cancer staging</option>
			<option value="pulmonary-embolism">Pulmonary embolism</option>
			<option value="abdominal-pain">Abdominal pain</option>
			<option value="renal-colic">Renal colic</option>
			<option value="infection-abscess">Infection / abscess</option>
			<option value="pre-surgical-planning">Pre-surgical planning</option>
			<option value="follow-up-surveillance">Follow-up surveillance</option>
			<option value="headache">Headache</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="e.g. Exclude intracranial haemorrhage in suspected acute stroke."
			bind:value={d.clinicalQuestion}
		/>
	</Field>
</Fieldset>
