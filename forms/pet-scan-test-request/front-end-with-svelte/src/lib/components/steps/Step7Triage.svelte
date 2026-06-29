<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.triage;
</script>

<Fieldset legend="7. Triage">
	<p class="hint">Requested-by date and any notes accompanying the request.</p>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
