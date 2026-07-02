<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.injuries;
</script>

<Fieldset legend="Step 7 of 11 — Injuries and status epilepticus">
	<p class="hint">Seizure-related harm since the last review.</p>

	<Field
		label="Status epilepticus since last review"
		description="Yes classifies control as uncontrolled and raises a high-priority flag."
		inputId="injuries-statusEpilepticus"
	>
		<Select
			id="injuries-statusEpilepticus"
			label="Status epilepticus since last review"
			bind:value={i.statusEpilepticus}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Seizure-related injury since last review" inputId="injuries-seizureInjury">
		<Select
			id="injuries-seizureInjury"
			label="Seizure-related injury since last review"
			bind:value={i.seizureInjury}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
