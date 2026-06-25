<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Test Details">
	<p class="hint">The genomic test performed, the genes / region analysed, and the sample.</p>

	<Field label="Test type" inputId="testType" required>
		<Select id="testType" label="Test type" bind:value={d.testType} required>
			<option value="">Select…</option>
			<option value="diagnostic-single-gene">Diagnostic single-gene</option>
			<option value="gene-panel">Gene panel</option>
			<option value="whole-exome">Whole exome</option>
			<option value="whole-genome">Whole genome</option>
			<option value="chromosomal-microarray">Chromosomal microarray</option>
			<option value="karyotype">Karyotype</option>
			<option value="predictive-presymptomatic">Predictive / presymptomatic</option>
			<option value="carrier-testing">Carrier testing</option>
			<option value="pharmacogenomic">Pharmacogenomic</option>
			<option value="prenatal">Prenatal</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Sample type" inputId="sampleType">
		<Select id="sampleType" label="Sample type" bind:value={d.sampleType}>
			<option value="">Select…</option>
			<option value="blood">Blood</option>
			<option value="saliva">Saliva</option>
			<option value="tissue">Tissue</option>
			<option value="prenatal">Prenatal</option>
		</Select>
	</Field>

	<Field
		label="Genes tested"
		inputId="genesTested"
		description="Gene symbols, panel name, or genomic region analysed."
	>
		<TextAreaInput
			id="genesTested"
			label="Genes tested"
			rows={3}
			placeholder="e.g. Hereditary cancer panel (BRCA1, BRCA2, PALB2, TP53)…"
			bind:value={d.genesTested}
		/>
	</Field>
</Fieldset>
