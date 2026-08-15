<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.triage;

	const urgencyOptions = [
		{ value: 'routine', label: 'Routine' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' }
	];
</script>

<Fieldset legend="Triage and submit">
	<p class="hint">
		Requested urgency, requested-by date, and notes. Submit to compute the four-axis grade and flags.
	</p>

	<div class="field-grid">
		<Field label="Requested urgency" required inputId="urgency">
			<Select id="urgency" label="Requested urgency" required bind:value={d.urgency}>
				<option value="">— Select —</option>
				{#each urgencyOptions as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Requested-by date" inputId="requestedByDate">
			<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
		</Field>
	</div>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} bind:value={d.notes} />
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
