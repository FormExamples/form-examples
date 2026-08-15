<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed stress-test modality and protocol.</p>

	<Field label="Test type" inputId="testType" required>
		<Select id="testType" label="Test type" bind:value={d.testType} required>
			<option value="">Select…</option>
			<option value="exercise-treadmill-ecg">Exercise treadmill ECG</option>
			<option value="stress-echo">Stress echocardiography</option>
			<option value="dobutamine-stress-echo">Dobutamine stress echo</option>
			<option value="myocardial-perfusion-spect">Myocardial perfusion SPECT</option>
			<option value="stress-cardiac-mri">Stress cardiac MRI</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Protocol" inputId="protocol">
		<TextAreaInput
			id="protocol"
			label="Protocol"
			rows={2}
			placeholder="Exercise / stress protocol (e.g. Bruce, modified Bruce, dobutamine infusion, vasodilator)…"
			bind:value={d.protocol}
		/>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the test was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
