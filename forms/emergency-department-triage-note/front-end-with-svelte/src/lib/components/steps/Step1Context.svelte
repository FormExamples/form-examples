<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Triage context">
	<p class="hint">Who is triaging the patient, when, and in which care setting.</p>

	<Field label="Triage nurse name" required inputId="context-nurseName">
		<TextInput
			id="context-nurseName"
			label="Triage nurse name"
			placeholder="e.g. Nurse J. Okafor"
			required
			bind:value={c.nurseName}
		/>
	</Field>

	<Field label="Date and time of triage" inputId="context-triagedAt">
		<TextInput
			id="context-triagedAt"
			label="Date and time of triage"
			type="datetime-local"
			class="date-input"
			bind:value={c.triagedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="urgent-treatment-centre">Urgent treatment centre</option>
			<option value="minor-injuries-unit">Minor injuries unit</option>
		</Select>
	</Field>
</Fieldset>
