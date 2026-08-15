<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const r = assessment.data.reading;
</script>

<Fieldset legend="Step 5 of 7 — Reading outcome">
	<p class="hint">
		Double reading with arbitration. The overall reading outcome drives the screening outcome.
	</p>

	<Field label="First-read opinion" inputId="reading-firstReadOpinion">
		<Select id="reading-firstReadOpinion" label="First-read opinion" bind:value={r.firstReadOpinion}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="recall">Recall</option>
			<option value="technical">Technical</option>
		</Select>
	</Field>

	<Field label="Second-read opinion" inputId="reading-secondReadOpinion">
		<Select id="reading-secondReadOpinion" label="Second-read opinion" bind:value={r.secondReadOpinion}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="recall">Recall</option>
			<option value="technical">Technical</option>
		</Select>
	</Field>

	<Field
		label="Arbitration outcome"
		description="Use when the two reads disagree."
		inputId="reading-arbitrationOutcome"
	>
		<Select id="reading-arbitrationOutcome" label="Arbitration outcome" bind:value={r.arbitrationOutcome}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="recall">Recall</option>
			<option value="technical">Technical</option>
			<option value="not-required">Not required (reads agree)</option>
		</Select>
	</Field>

	<Field label="Overall reading outcome" required inputId="reading-readingOutcome">
		<Select id="reading-readingOutcome" label="Overall reading outcome" required bind:value={r.readingOutcome}>
			<option value="">— Select —</option>
			<option value="normal-routine-recall">Normal — routine recall</option>
			<option value="technical-repeat">Technical repeat</option>
			<option value="recall-for-assessment">Recall for assessment</option>
		</Select>
	</Field>
</Fieldset>
