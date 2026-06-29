<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = request.data.procedure;
</script>

<Fieldset legend="Requested procedure">
	<p class="hint">Biopsy site, method, and laterality — drives the appropriateness axis.</p>

	<div class="field-grid">
		<Field label="Biopsy site" required inputId="biopsySite">
			<Select id="biopsySite" label="Biopsy site" required bind:value={d.biopsySite}>
				<option value="">— Select —</option>
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
		<Field label="Biopsy method" required inputId="biopsyMethod">
			<Select id="biopsyMethod" label="Biopsy method" required bind:value={d.biopsyMethod}>
				<option value="">— Select —</option>
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
	</div>

	<div class="field-grid">
		<Field label="Laterality" inputId="laterality">
			<Select id="laterality" label="Laterality" bind:value={d.laterality}>
				<option value="">— Select —</option>
				<option value="left">Left</option>
				<option value="right">Right</option>
				<option value="bilateral">Bilateral</option>
				<option value="not-applicable">Not applicable</option>
			</Select>
		</Field>
		<Field label="Care setting" inputId="setting">
			<Select id="setting" label="Care setting" bind:value={d.setting}>
				<option value="">— Select —</option>
				<option value="outpatient">Outpatient</option>
				<option value="inpatient">Inpatient</option>
				<option value="community">Community</option>
				<option value="emergency">Emergency</option>
			</Select>
		</Field>
	</div>

	<Field label="Image guidance">
		<label class="checkbox-row">
			<CheckboxInput label="Image guidance required" bind:checked={d.imagingGuidanceRequired} />
			Image guidance required (ultrasound / CT / MRI)
		</label>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
