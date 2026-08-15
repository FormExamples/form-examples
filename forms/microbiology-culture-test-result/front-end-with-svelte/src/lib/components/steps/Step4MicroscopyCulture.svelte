<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Microscopy & Culture">
	<p class="hint">The Gram-stain microscopy, overall culture outcome, and organism(s) isolated.</p>

	<Field label="Gram stain result" inputId="gramStainResult">
		<TextAreaInput
			id="gramStainResult"
			label="Gram stain result"
			rows={3}
			placeholder="e.g. Gram-positive cocci in clusters; no organisms seen…"
			bind:value={d.gramStainResult}
		/>
	</Field>

	<Field label="Culture result" inputId="cultureResult">
		<Select id="cultureResult" label="Culture result" bind:value={d.cultureResult}>
			<option value="">Select…</option>
			<option value="no-growth">No growth</option>
			<option value="mixed-growth">Mixed growth</option>
			<option value="significant-growth">Significant growth</option>
			<option value="positive">Positive</option>
		</Select>
	</Field>

	<Field label="Organism isolated" inputId="organismIsolated">
		<TextInput
			id="organismIsolated"
			label="Organism isolated"
			placeholder="e.g. Escherichia coli"
			bind:value={d.organismIsolated}
		/>
	</Field>

	<Field label="Second organism isolated" inputId="secondOrganismIsolated">
		<TextInput
			id="secondOrganismIsolated"
			label="Second organism isolated"
			placeholder="Second organism, where applicable"
			bind:value={d.secondOrganismIsolated}
		/>
	</Field>

	<Field
		label="Colony count"
		inputId="colonyCount"
		description="Quantification of growth (e.g. >100,000 CFU/mL for urine)."
	>
		<TextInput
			id="colonyCount"
			label="Colony count"
			placeholder="e.g. >100,000 CFU/mL"
			bind:value={d.colonyCount}
		/>
	</Field>
</Fieldset>
