<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.specimen;
</script>

<Fieldset legend="6. Specimen">
	<p class="hint">Specimen type and collection — drives the preanalytical axis (UK SMI B41).</p>

	<Field label="Specimen type" inputId="specimenType">
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType}>
			<option value="">Select…</option>
			<option value="midstream">Midstream (MSU)</option>
			<option value="catheter">Catheter (CSU)</option>
			<option value="clean-catch">Clean-catch</option>
			<option value="24h">24-hour</option>
			<option value="random">Random</option>
		</Select>
	</Field>

	<Field label="Specimen collected" inputId="specimenCollected">
		<Select id="specimenCollected" label="Specimen collected" bind:value={d.specimenCollected}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Collection date & time" inputId="collectionDatetime">
		<TextInput id="collectionDatetime" type="datetime-local" label="Collection date & time" bind:value={d.collectionDatetime} />
	</Field>
</Fieldset>
