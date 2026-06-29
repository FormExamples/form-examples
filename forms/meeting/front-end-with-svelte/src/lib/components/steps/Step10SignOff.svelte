<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = meeting.data.signoff;
</script>

<Fieldset legend="Sign-off">
	<p class="hint">The overall result, any closing notes, and an electronic signature.</p>

	<Field label="Overall result" inputId="overallResult">
		<Select id="overallResult" label="Overall result" bind:value={s.overallResult}>
			<option value="">Select…</option>
			<option value="productive">Productive</option>
			<option value="partial">Partial</option>
			<option value="unproductive">Unproductive</option>
			<option value="cancelled">Cancelled</option>
		</Select>
	</Field>
	<Field label="Additional notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={3} placeholder="Optional closing notes." bind:value={s.additionalNotes} />
	</Field>
	<Field label="Signed by" inputId="signedByName">
		<TextInput id="signedByName" label="Signed by" placeholder="Name of the person signing off" bind:value={s.signedByName} />
	</Field>
	<Field label="Signed at" inputId="signedAt">
		<input id="signedAt" class="date-input" type="date" aria-label="Signed at" bind:value={s.signedAt} />
	</Field>
</Fieldset>
