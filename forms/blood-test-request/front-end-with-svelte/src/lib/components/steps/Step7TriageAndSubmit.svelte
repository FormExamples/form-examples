<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.triage;
</script>

<Fieldset legend="7. Triage and Submit">
	<p class="hint">
		The requested urgency, the care setting, and any notes. A critical test (troponin, d-dimer,
		blood culture, crossmatch) escalates triage to stat regardless of the requested urgency.
	</p>

	<Field label="Requested urgency" inputId="urgency" required description="The engine may escalate this if a critical test is selected, but will not lower it.">
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="stat">Stat (immediate)</option>
		</Select>
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="gp-surgery">GP surgery</option>
			<option value="hospital-ward">Hospital ward</option>
			<option value="outpatient">Outpatient clinic</option>
			<option value="community">Community phlebotomy</option>
			<option value="emergency">Emergency department</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Any additional information for the laboratory vetting desk…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
