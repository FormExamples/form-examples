<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Samples & Complications">
	<p class="hint">Samples taken during the procedure and any procedural complication.</p>

	<Field
		label="Samples taken"
		inputId="samplesTaken"
		description="e.g. biopsy, BAL, brushings, EBUS-TBNA."
	>
		<TextAreaInput
			id="samplesTaken"
			label="Samples taken"
			rows={3}
			placeholder="Samples taken during the procedure…"
			bind:value={d.samplesTaken}
		/>
	</Field>

	<Field label="Complication" inputId="complication">
		<Select id="complication" label="Complication" bind:value={d.complication}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="bleeding">Bleeding</option>
			<option value="pneumothorax">Pneumothorax</option>
			<option value="hypoxia">Hypoxia</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if d.complication === 'pneumothorax'}
		<Alert type="error" heading="Critical complication selected">
			<p>
				A procedural pneumothorax auto-escalates the follow-up urgency to a critical alert. Ensure
				the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
