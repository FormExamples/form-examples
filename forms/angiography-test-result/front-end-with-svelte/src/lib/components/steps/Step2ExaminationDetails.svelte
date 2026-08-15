<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, modality, contrast, and adequacy.</p>

	<Field label="Angiography type" inputId="angiographyType" required>
		<Select id="angiographyType" label="Angiography type" bind:value={d.angiographyType} required>
			<option value="">Select…</option>
			<option value="ct-angiography">CT angiography (CTA)</option>
			<option value="mr-angiography">MR angiography (MRA)</option>
			<option value="catheter-dsa">Catheter / DSA</option>
			<option value="coronary-angiography">Coronary angiography</option>
			<option value="peripheral-angiography">Peripheral angiography</option>
			<option value="cerebral-angiography">Cerebral angiography</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="coronary">Coronary</option>
			<option value="cerebral">Cerebral</option>
			<option value="carotid">Carotid</option>
			<option value="aorta">Aorta</option>
			<option value="renal">Renal</option>
			<option value="peripheral-lower-limb">Peripheral lower limb</option>
			<option value="pulmonary">Pulmonary</option>
			<option value="mesenteric">Mesenteric</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Contrast used" inputId="contrastUsed">
		<Select id="contrastUsed" label="Contrast used" bind:value={d.contrastUsed}>
			<option value="">Select…</option>
			<option value="iodinated">Iodinated</option>
			<option value="gadolinium">Gadolinium</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field label="Examination adequacy" inputId="examinationAdequacy">
		<Select id="examinationAdequacy" label="Examination adequacy" bind:value={d.examinationAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>
</Fieldset>
