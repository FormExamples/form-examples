<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const ce = assessment.data.clinicalExamination;
</script>

<Fieldset title="Clinical Examination" description="Systematic clinical examination findings">
	<TextAreaInput label="General Appearance" name="generalAppearance" bind:value={ce.generalAppearance} placeholder="e.g. alert, orientated, comfortable at rest" />
	<TextAreaInput label="Head & Face" name="headAndFace" bind:value={ce.headAndFace} rows={2} />
	<TextAreaInput label="Neck" name="neck" bind:value={ce.neck} rows={2} />
	<TextAreaInput label="Chest — Cardiovascular" name="chestCardiovascular" bind:value={ce.chestCardiovascular} rows={2} />
	<TextAreaInput label="Chest — Respiratory" name="chestRespiratory" bind:value={ce.chestRespiratory} rows={2} />
	<TextAreaInput label="Abdomen" name="abdomen" bind:value={ce.abdomen} rows={2} />
	<TextAreaInput label="Pelvis" name="pelvis" bind:value={ce.pelvis} rows={2} />
	<TextAreaInput label="Musculoskeletal / Limbs" name="musculoskeletalLimbs" bind:value={ce.musculoskeletalLimbs} rows={2} />
	<TextAreaInput label="Neurological" name="neurological" bind:value={ce.neurological} rows={2} />
	<TextAreaInput label="Skin" name="skin" bind:value={ce.skin} rows={2} />
	<TextAreaInput label="Mental State" name="mentalState" bind:value={ce.mentalState} rows={2} />
	<TextAreaInput label="Body Diagram Notes" name="bodyDiagramNotes" bind:value={ce.bodyDiagramNotes} placeholder="Document any injury locations or findings" rows={3} />
</Fieldset>
