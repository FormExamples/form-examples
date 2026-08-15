<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested test, the eye(s) to examine, the indication, and the specific clinical question.</p>

	<Field label="Requested test type" inputId="testType" required>
		<Select id="testType" label="Requested test type" bind:value={d.testType} required>
			<option value="">Select…</option>
			<option value="visual-acuity">Visual acuity</option>
			<option value="visual-fields">Visual fields</option>
			<option value="refraction">Refraction</option>
			<option value="fundus-examination">Fundus examination</option>
			<option value="optical-coherence-tomography">Optical coherence tomography (OCT)</option>
			<option value="fluorescein-angiography">Fluorescein angiography</option>
			<option value="tonometry">Tonometry</option>
			<option value="slit-lamp">Slit-lamp examination</option>
			<option value="orthoptic-assessment">Orthoptic assessment</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality" required description="Which eye(s) to examine.">
		<Select id="laterality" label="Laterality" bind:value={d.laterality} required>
			<option value="">Select…</option>
			<option value="right">Right eye</option>
			<option value="left">Left eye</option>
			<option value="both">Both eyes</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="reduced-vision">Reduced vision</option>
			<option value="suspected-glaucoma">Suspected glaucoma</option>
			<option value="diabetic-retinopathy-screening">Diabetic retinopathy screening</option>
			<option value="sudden-visual-loss">Sudden visual loss</option>
			<option value="flashes-floaters">Flashes / floaters</option>
			<option value="red-eye">Red eye</option>
			<option value="childhood-squint">Childhood squint</option>
			<option value="visual-field-defect">Visual-field defect</option>
			<option value="cataract-assessment">Cataract assessment</option>
			<option value="headache-visual-symptoms">Headache with visual symptoms</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the examination should answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>
</Fieldset>
