<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.cognition;
</script>

<Fieldset legend="Step 9 of 10 — Cognition">
	<p class="hint">ASEPTIC domain C — orientation, attention, memory, and gross impression.</p>

	<Field
		label="Orientation"
		description="Global disorientation raises a cognitive-impairment flag."
		inputId="cognition-orientation"
	>
		<Select id="cognition-orientation" label="Orientation" bind:value={c.orientation}>
			<option value="">— Select —</option>
			<option value="orientated">Orientated</option>
			<option value="disorientated-time">Disorientated to time</option>
			<option value="disorientated-place">Disorientated to place</option>
			<option value="disorientated-person">Disorientated to person</option>
			<option value="global">Global disorientation</option>
		</Select>
	</Field>

	<Field label="Attention and concentration" inputId="cognition-attention">
		<Select id="cognition-attention" label="Attention and concentration" bind:value={c.attention}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="impaired">Impaired</option>
		</Select>
	</Field>

	<Field label="Memory" inputId="cognition-memory">
		<Select id="cognition-memory" label="Memory" bind:value={c.memory}>
			<option value="">— Select —</option>
			<option value="intact">Intact</option>
			<option value="short-term-impaired">Short-term impaired</option>
			<option value="long-term-impaired">Long-term impaired</option>
			<option value="global-impairment">Global impairment</option>
		</Select>
	</Field>

	<Field
		label="Gross cognitive impression"
		description="Significant concern raises a cognitive-impairment flag."
		inputId="cognition-cognitiveImpression"
	>
		<Select
			id="cognition-cognitiveImpression"
			label="Gross cognitive impression"
			bind:value={c.cognitiveImpression}
		>
			<option value="">— Select —</option>
			<option value="no-concern">No concern</option>
			<option value="mild-concern">Mild concern</option>
			<option value="significant-concern">Significant concern</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="cognition-cognitionNotes">
		<TextAreaInput
			id="cognition-cognitionNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on cognition."
			bind:value={c.cognitionNotes}
		/>
	</Field>
</Fieldset>
