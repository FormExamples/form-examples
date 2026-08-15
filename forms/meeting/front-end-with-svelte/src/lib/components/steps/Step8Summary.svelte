<script lang="ts">
	import { meeting } from '#lib/stores/meeting.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = meeting.data.summary;
	const count = $derived((s.summary ?? '').length);
	const over = $derived(count > 250);
</script>

<Fieldset legend="Summary">
	<p class="hint">A single paragraph describing what happened, capped at 250 characters.</p>

	<Field label="Summary" inputId="summary">
		<TextAreaInput id="summary" label="Summary" rows={4} maxlength={250} placeholder="One paragraph, max 250 characters." bind:value={s.summary} />
		<p class="hint" class:text-error={over}>{count} / 250 characters</p>
	</Field>

	<Field label="Actual start" inputId="actualStartAt" description="Optional — used to compute the realised duration.">
		<input id="actualStartAt" class="text-input" type="datetime-local" aria-label="Actual start" bind:value={s.actualStartAt} />
	</Field>
	<Field label="Actual end" inputId="actualEndAt">
		<input id="actualEndAt" class="text-input" type="datetime-local" aria-label="Actual end" bind:value={s.actualEndAt} />
	</Field>
</Fieldset>
