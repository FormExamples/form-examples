<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = assessment.data.boneMarrowAssessment;
</script>

<Fieldset legend="Bone Marrow Assessment">
	<p class="hint">Enter bone marrow aspirate and biopsy findings if applicable</p>
	<Field label="Aspirate Findings" inputId="aspirateFindings"><TextAreaInput id="aspirateFindings" label="Aspirate Findings" placeholder="e.g. Adequate cellularity, trilineage hematopoiesis present" bind:value={d.aspirateFindings} /></Field>
	<Field label="Biopsy Findings" inputId="biopsyFindings"><TextAreaInput id="biopsyFindings" label="Biopsy Findings" placeholder="e.g. Normocellular marrow for age, no fibrosis" bind:value={d.biopsyFindings} /></Field>

	<Field label="Cellularity Rating (1-5)" inputId="cellularity"><Select id="cellularity" label="Cellularity Rating (1-5)" bind:value={d.cellularity as unknown as string}><option value="">-- Select --</option>{#each [
			{ value: '1', label: '1 - Markedly Hypocellular' },
			{ value: '2', label: '2 - Hypocellular' },
			{ value: '3', label: '3 - Normocellular' },
			{ value: '4', label: '4 - Hypercellular' },
			{ value: '5', label: '5 - Markedly Hypercellular' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Cytogenetics Results" inputId="cytogeneticsResults"><TextAreaInput id="cytogeneticsResults" label="Cytogenetics Results" rows={2} placeholder="e.g. Normal karyotype 46,XX or 46,XY" bind:value={d.cytogeneticsResults} /></Field>
	<Field label="Flow Cytometry Results" inputId="flowCytometryResults"><TextAreaInput id="flowCytometryResults" label="Flow Cytometry Results" rows={2} placeholder="e.g. No aberrant immunophenotype detected" bind:value={d.flowCytometryResults} /></Field>
	<Field label="Additional Comments" inputId="boneMarrowComments"><TextAreaInput id="boneMarrowComments" label="Additional Comments" rows={2} placeholder="Any additional bone marrow findings" bind:value={d.boneMarrowComments} /></Field>
</Fieldset>
