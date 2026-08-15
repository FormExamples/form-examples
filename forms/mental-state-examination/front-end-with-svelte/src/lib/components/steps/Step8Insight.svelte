<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.insight;
</script>

<Fieldset legend="Step 8 of 10 — Insight and judgement">
	<p class="hint">ASEPTIC domain I — insight into illness, treatment attitude, and judgement.</p>

	<Field
		label="Insight into illness"
		description="No insight alongside another risk flag raises a lack-of-insight flag."
		inputId="insight-insightLevel"
	>
		<Select id="insight-insightLevel" label="Insight into illness" bind:value={i.insightLevel}>
			<option value="">— Select —</option>
			<option value="full">Full</option>
			<option value="partial">Partial</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field label="Understanding of treatment" inputId="insight-treatmentUnderstanding">
		<Select
			id="insight-treatmentUnderstanding"
			label="Understanding of treatment"
			bind:value={i.treatmentUnderstanding}
		>
			<option value="">— Select —</option>
			<option value="accepts">Accepts treatment</option>
			<option value="ambivalent">Ambivalent</option>
			<option value="refuses">Refuses treatment</option>
		</Select>
	</Field>

	<Field label="Judgement" inputId="insight-judgement">
		<Select id="insight-judgement" label="Judgement" bind:value={i.judgement}>
			<option value="">— Select —</option>
			<option value="intact">Intact</option>
			<option value="impaired">Impaired</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="insight-insightNotes">
		<TextAreaInput
			id="insight-insightNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on insight and judgement."
			bind:value={i.insightNotes}
		/>
	</Field>
</Fieldset>
