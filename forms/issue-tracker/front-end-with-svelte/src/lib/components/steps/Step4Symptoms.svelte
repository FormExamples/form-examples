<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const s = assessment.data.sx;
</script>

<Fieldset legend="Symptoms">
	<p class="hint">The observable signals — what the issue looks like from the outside.</p>

	<Field label="External signals" inputId="sxExternalSignals" description="Visible symptoms users or monitoring can observe.">
		<TextAreaInput id="sxExternalSignals" label="External signals" rows={3} bind:value={s.sxExternalSignals} />
	</Field>

	<Field label="Alert IDs" inputId="sxAlertIds">
		<TextInput id="sxAlertIds" label="Alert IDs" placeholder="e.g. PD-1234, GRAFANA-77" bind:value={s.sxAlertIds} />
	</Field>

	<Field label="Error messages" inputId="sxErrorMessages">
		<TextAreaInput id="sxErrorMessages" label="Error messages" rows={3} bind:value={s.sxErrorMessages} />
	</Field>

	<div class="field-grid">
		<Field label="Screenshots URL" inputId="sxScreenshotsUrl">
			<TextInput id="sxScreenshotsUrl" label="Screenshots URL" type="url" bind:value={s.sxScreenshotsUrl} />
		</Field>
		<Field label="Logs URL" inputId="sxLogsUrl">
			<TextInput id="sxLogsUrl" label="Logs URL" type="url" bind:value={s.sxLogsUrl} />
		</Field>
	</div>

	<Field label="First observed at" inputId="sxFirstObservedAt">
		<DateInput id="sxFirstObservedAt" label="First observed at" bind:value={s.sxFirstObservedAt} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
