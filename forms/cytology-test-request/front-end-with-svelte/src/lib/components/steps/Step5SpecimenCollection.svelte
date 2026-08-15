<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="5. Specimen Collection">
	<p class="hint">Pre-analytical timing — drives the specimen-adequacy axis.</p>

	<Field label="Specimen collected?" inputId="specimenCollected">
		<Select id="specimenCollected" label="Specimen collected?" bind:value={d.collection.specimenCollected}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Collection date & time"
		inputId="collectionDatetime"
		description="Used to assess pre-analytical degradation risk."
	>
		<TextInput
			id="collectionDatetime"
			label="Collection date & time"
			type="datetime-local"
			bind:value={d.collection.collectionDatetime}
		/>
	</Field>
</Fieldset>
