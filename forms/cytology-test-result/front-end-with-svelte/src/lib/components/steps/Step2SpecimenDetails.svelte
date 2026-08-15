<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen Details">
	<p class="hint">The examined specimen type and its adequacy for interpretation.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType} required>
			<option value="">Select…</option>
			<option value="cervical-smear">Cervical smear</option>
			<option value="urine-cytology">Urine cytology</option>
			<option value="sputum-cytology">Sputum cytology</option>
			<option value="fluid-pleural-ascitic">Serous fluid (pleural / ascitic)</option>
			<option value="fine-needle-aspiration-thyroid">Thyroid FNA</option>
			<option value="fine-needle-aspiration-breast">Breast FNA</option>
			<option value="csf-cytology">CSF cytology</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen adequacy" inputId="specimenAdequacy">
		<Select id="specimenAdequacy" label="Specimen adequacy" bind:value={d.specimenAdequacy}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="unsatisfactory">Unsatisfactory</option>
		</Select>
	</Field>
</Fieldset>
