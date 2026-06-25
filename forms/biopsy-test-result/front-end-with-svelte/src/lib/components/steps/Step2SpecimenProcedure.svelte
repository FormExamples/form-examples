<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen & Procedure">
	<p class="hint">The anatomical site, biopsy method, and specimen adequacy.</p>

	<Field label="Biopsy site" inputId="biopsySite" required>
		<Select id="biopsySite" label="Biopsy site" bind:value={d.biopsySite} required>
			<option value="">Select…</option>
			<option value="skin">Skin</option>
			<option value="breast">Breast</option>
			<option value="lymph-node">Lymph node</option>
			<option value="liver">Liver</option>
			<option value="kidney">Kidney</option>
			<option value="prostate">Prostate</option>
			<option value="lung">Lung</option>
			<option value="bone-marrow">Bone marrow</option>
			<option value="gi-tract">GI tract</option>
			<option value="thyroid">Thyroid</option>
			<option value="soft-tissue">Soft tissue</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Biopsy method" inputId="biopsyMethod">
		<Select id="biopsyMethod" label="Biopsy method" bind:value={d.biopsyMethod}>
			<option value="">Select…</option>
			<option value="punch">Punch</option>
			<option value="excision">Excision</option>
			<option value="incision">Incision</option>
			<option value="core-needle">Core needle</option>
			<option value="fine-needle-aspiration">Fine-needle aspiration</option>
			<option value="image-guided">Image-guided</option>
			<option value="endoscopic">Endoscopic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen adequacy" inputId="specimenAdequacy">
		<Select id="specimenAdequacy" label="Specimen adequacy" bind:value={d.specimenAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="suboptimal">Suboptimal</option>
			<option value="inadequate">Inadequate</option>
		</Select>
	</Field>
</Fieldset>
