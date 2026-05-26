<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data.peripheralBloodFilm;
</script>

<Fieldset legend="Peripheral Blood Film">
	<p class="hint">Describe findings from the peripheral blood smear examination</p>
	<Field label="Red Cell Morphology" inputId="redCellMorphology"><TextAreaInput id="redCellMorphology" label="Red Cell Morphology" placeholder="e.g. Normochromic normocytic, microcytic hypochromic, target cells present" bind:value={d.redCellMorphology} /></Field>
	<Field label="White Blood Cell Differential" inputId="whiteBloodCellDifferential"><TextAreaInput id="whiteBloodCellDifferential" label="White Blood Cell Differential" placeholder="e.g. Neutrophils 60%, Lymphocytes 30%, Monocytes 5%, Eosinophils 3%, Basophils 2%" bind:value={d.whiteBloodCellDifferential} /></Field>
	<Field label="Platelet Morphology" inputId="plateletMorphology"><TextAreaInput id="plateletMorphology" label="Platelet Morphology" rows={2} placeholder="e.g. Adequate number, normal morphology" bind:value={d.plateletMorphology} /></Field>
	<Field label="Abnormal Cell Morphology" inputId="abnormalCellMorphology"><TextAreaInput id="abnormalCellMorphology" label="Abnormal Cell Morphology" placeholder="e.g. Blast cells, atypical lymphocytes, schistocytes" bind:value={d.abnormalCellMorphology} /></Field>

	<Field label="Film Quality (1-5)" inputId="filmQuality"><Select id="filmQuality" label="Film Quality (1-5)" bind:value={d.filmQuality as unknown as string}><option value="">-- Select --</option>{#each [
			{ value: '1', label: '1 - Poor' },
			{ value: '2', label: '2 - Below Average' },
			{ value: '3', label: '3 - Adequate' },
			{ value: '4', label: '4 - Good' },
			{ value: '5', label: '5 - Excellent' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Additional Film Comments" inputId="filmComments"><TextAreaInput id="filmComments" label="Additional Film Comments" rows={2} placeholder="Any additional observations" bind:value={d.filmComments} /></Field>
</Fieldset>
