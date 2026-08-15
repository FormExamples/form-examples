<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/result.svelte.js';

	const d = request.data.specimen;
</script>

<Fieldset legend="3. Specimen">
	<p class="hint">Specimen type, site, number of pots, and fixative — drives the specimen-quality axis.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType} required>
			<option value="">Select…</option>
			<option value="biopsy">Biopsy</option>
			<option value="excision">Excision</option>
			<option value="resection">Resection</option>
			<option value="endoscopic-biopsy">Endoscopic biopsy</option>
			<option value="skin-lesion">Skin lesion</option>
			<option value="frozen-section">Frozen section</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Anatomical site" inputId="specimenSite" required>
		<TextInput
			id="specimenSite"
			label="Anatomical site"
			placeholder="e.g. Sigmoid colon, left breast, right forearm skin"
			bind:value={d.specimenSite}
			required
		/>
	</Field>

	<Field label="Number of specimens / pots" inputId="numberOfSpecimens">
		<NumberInput
			id="numberOfSpecimens"
			label="Number of specimens / pots"
			min={0}
			max={100}
			bind:value={d.numberOfSpecimens}
		/>
	</Field>

	<Field label="Fixative" inputId="fixative">
		<Select id="fixative" label="Fixative" bind:value={d.fixative}>
			<option value="">Select…</option>
			<option value="formalin">Formalin</option>
			<option value="fresh">Fresh (unfixed)</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen container labelled with patient identifiers" inputId="specimenLabelled">
		<CheckboxInput
			id="specimenLabelled"
			label="Specimen container labelled with patient identifiers"
			bind:checked={d.specimenLabelled}
		/>
	</Field>
</Fieldset>
