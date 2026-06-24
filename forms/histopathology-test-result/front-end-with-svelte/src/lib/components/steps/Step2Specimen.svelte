<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen">
	<p class="hint">The examined specimen, its anatomical site, and its diagnostic adequacy.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<TextInput
			id="specimenType"
			label="Specimen type"
			placeholder="e.g. core biopsy, excision, resection, endoscopic biopsy"
			bind:value={d.specimenType}
			required
		/>
	</Field>

	<Field label="Specimen site" inputId="specimenSite">
		<TextInput
			id="specimenSite"
			label="Specimen site"
			placeholder="e.g. right breast, sigmoid colon, left forearm skin"
			bind:value={d.specimenSite}
		/>
	</Field>

	<Field
		label="Specimen adequacy"
		inputId="specimenAdequacy"
		description="An inadequate specimen classifies the result as inconclusive."
	>
		<Select id="specimenAdequacy" label="Specimen adequacy" bind:value={d.specimenAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="suboptimal">Suboptimal</option>
			<option value="inadequate">Inadequate</option>
		</Select>
	</Field>
</Fieldset>
