<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.history;
</script>

<Fieldset legend="Step 3 of 8 — Presenting complaint">
	<p class="hint">Required components — the presenting complaint and its history.</p>

	<Field label="Presenting complaint" inputId="history-presentingComplaint">
		<TextAreaInput
			id="history-presentingComplaint"
			label="Presenting complaint"
			rows={2}
			placeholder="e.g. Central chest pain for 2 hours"
			bind:value={h.presentingComplaint}
		/>
	</Field>

	<Field label="History of presenting complaint" inputId="history-historyOfPresentingComplaint">
		<TextAreaInput
			id="history-historyOfPresentingComplaint"
			label="History of presenting complaint"
			rows={5}
			placeholder="Onset, character, radiation, associated features, prior episodes..."
			bind:value={h.historyOfPresentingComplaint}
		/>
	</Field>
</Fieldset>
