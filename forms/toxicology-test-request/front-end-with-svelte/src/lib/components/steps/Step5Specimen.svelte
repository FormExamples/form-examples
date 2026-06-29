<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.specimen;
</script>

<Fieldset legend="5. Specimen">
	<p class="hint">Specimen collection status and time.</p>

	<Field label="Specimen collected" inputId="specimenCollected">
		<Select id="specimenCollected" label="Specimen collected" bind:value={d.specimenCollected}>
			<option value="">— Select —</option>
			<option value="yes">Yes — collected</option>
			<option value="no">No — not yet collected</option>
		</Select>
	</Field>

	<Field label="Collection date-time" inputId="collectionDatetime">
		<TextInput
			id="collectionDatetime"
			label="Collection date-time"
			type="datetime-local"
			class="datetime-input"
			bind:value={d.collectionDatetime}
		/>
	</Field>
</Fieldset>
