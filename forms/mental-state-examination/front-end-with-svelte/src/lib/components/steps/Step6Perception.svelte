<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.perception;
</script>

<Fieldset legend="Step 6 of 10 — Perception">
	<p class="hint">ASEPTIC domain P — hallucinations, illusions, and dissociative phenomena.</p>

	<Field label="Hallucinations present" inputId="perception-hallucinationsPresent">
		<Select
			id="perception-hallucinationsPresent"
			label="Hallucinations present"
			bind:value={p.hallucinationsPresent}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="auditory">Auditory</option>
			<option value="visual">Visual</option>
			<option value="olfactory">Olfactory</option>
			<option value="gustatory">Gustatory</option>
			<option value="tactile">Tactile</option>
			<option value="multiple">Multiple modalities</option>
		</Select>
	</Field>

	<Field
		label="Command hallucinations"
		description="Yes raises a high-priority command-hallucinations flag."
		inputId="perception-commandHallucinations"
	>
		<Select
			id="perception-commandHallucinations"
			label="Command hallucinations"
			bind:value={p.commandHallucinations}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Illusions" inputId="perception-illusions">
		<Select id="perception-illusions" label="Illusions" bind:value={p.illusions}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field label="Depersonalisation" inputId="perception-depersonalisation">
		<Select
			id="perception-depersonalisation"
			label="Depersonalisation"
			bind:value={p.depersonalisation}
		>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field label="Derealisation" inputId="perception-derealisation">
		<Select id="perception-derealisation" label="Derealisation" bind:value={p.derealisation}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="perception-perceptionNotes">
		<TextAreaInput
			id="perception-perceptionNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on perception."
			bind:value={p.perceptionNotes}
		/>
	</Field>
</Fieldset>
