<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.justification;
</script>

<Fieldset legend="6. Radiation Justification">
	<p class="hint">IR(ME)R justification statement and requested urgency.</p>

	<Field label="IR(ME)R justification statement" inputId="irMeRJustification">
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification statement"
			rows={3}
			placeholder="State why the benefit of the radiation exposure outweighs the dose."
			bind:value={d.irMeRJustification}
		/>
	</Field>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>
</Fieldset>
