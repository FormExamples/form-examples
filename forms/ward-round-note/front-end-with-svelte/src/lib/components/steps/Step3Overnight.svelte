<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const o = assessment.data.overnight;
</script>

<Fieldset legend="Step 3 of 11 — Overnight events">
	<p class="hint">
		Events since the previous review. Recommended component — record events or select "no events
		overnight".
	</p>

	<Field label="Overnight events" inputId="overnight-overnightEvents">
		<TextAreaInput
			id="overnight-overnightEvents"
			label="Overnight events"
			rows={3}
			placeholder="e.g. Settled overnight. One episode of chest pain at 03:00, ECG unchanged."
			bind:value={o.overnightEvents}
		/>
	</Field>

	<Field
		label="No events overnight?"
		description="Yes documents the overnight component as a deliberate negative."
		inputId="overnight-noOvernightEvents"
	>
		<Select id="overnight-noOvernightEvents" label="No events overnight?" bind:value={o.noOvernightEvents}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
