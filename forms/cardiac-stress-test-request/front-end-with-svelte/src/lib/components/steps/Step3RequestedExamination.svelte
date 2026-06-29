<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested test type, the primary indication, and the specific clinical question.</p>

	<Field label="Requested test type" inputId="testType" required>
		<Select id="testType" label="Requested test type" bind:value={d.request.testType} required>
			<option value="">Select…</option>
			<option value="exercise-treadmill-ecg">Exercise treadmill ECG</option>
			<option value="stress-echo">Stress echocardiography</option>
			<option value="dobutamine-stress-echo">Dobutamine stress echo</option>
			<option value="myocardial-perfusion-spect">Myocardial perfusion SPECT</option>
			<option value="stress-cardiac-mri">Stress cardiac MRI</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.request.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-angina">Suspected angina</option>
			<option value="known-cad-assessment">Known CAD assessment</option>
			<option value="risk-stratification-post-mi">Risk stratification post-MI</option>
			<option value="pre-operative-cardiac">Pre-operative cardiac</option>
			<option value="exercise-tolerance">Exercise tolerance</option>
			<option value="arrhythmia-evaluation">Arrhythmia evaluation</option>
			<option value="valve-disease">Valve disease</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the stress test is asked to answer…"
			bind:value={d.request.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={2}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.request.relevantHistory}
		/>
	</Field>
</Fieldset>
