<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = request.data.triage;
</script>

<Fieldset legend="Triage & submit">
	<p class="hint">
		Requested urgency, setting, and notes. Submit to compute the four-axis grade and flags.
	</p>

	<div class="field-grid">
		<Field label="Requested urgency" required inputId="urgency">
			<Select id="urgency" label="Requested urgency" required bind:value={t.urgency}>
				<option value="">— Select —</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
			</Select>
		</Field>
		<Field label="Requested-by date" inputId="requestedByDate">
			<DateInput id="requestedByDate" label="Requested-by date" bind:value={t.requestedByDate} />
		</Field>
	</div>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={t.setting}>
			<option value="">— Select —</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} bind:value={t.notes} />
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
