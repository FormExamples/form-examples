<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Test">
	<p class="hint">Test type, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested test type" inputId="testType" required>
		<Select label="Requested test type" id="testType" bind:value={d.testType} required>
			<option value="">— Select —</option>
			<option value="spirometry">Spirometry</option>
			<option value="spirometry-with-reversibility">Spirometry with reversibility</option>
			<option value="full-lung-function">Full lung function</option>
			<option value="gas-transfer-dlco">Gas transfer (DLCO)</option>
			<option value="peak-flow">Peak flow</option>
			<option value="feno">FeNO</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select label="Primary indication" id="primaryIndication" bind:value={d.primaryIndication} required>
			<option value="">— Select —</option>
			<option value="suspected-asthma">Suspected asthma</option>
			<option value="suspected-copd">Suspected COPD</option>
			<option value="breathlessness">Breathlessness</option>
			<option value="chronic-cough">Chronic cough</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="occupational-lung-disease">Occupational lung disease</option>
			<option value="monitoring">Monitoring</option>
			<option value="restrictive-disease">Restrictive disease</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Confirm airflow obstruction and bronchodilator reversibility."
			bind:value={d.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={2}
			placeholder="Respiratory, medical, and occupational history."
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
