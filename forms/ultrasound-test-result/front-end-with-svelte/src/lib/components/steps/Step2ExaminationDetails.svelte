<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, laterality, and diagnostic adequacy.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="abdomen">Abdomen</option>
			<option value="pelvis">Pelvis</option>
			<option value="renal-tract">Renal tract</option>
			<option value="liver-biliary">Liver / biliary</option>
			<option value="thyroid-neck">Thyroid / neck</option>
			<option value="scrotum-testes">Scrotum / testes</option>
			<option value="breast">Breast</option>
			<option value="soft-tissue">Soft tissue</option>
			<option value="vascular-doppler">Vascular Doppler</option>
			<option value="dvt-leg">DVT leg</option>
			<option value="carotid">Carotid</option>
			<option value="msk-joint">MSK / joint</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={d.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Examination adequacy" inputId="examinationAdequacy">
		<Select id="examinationAdequacy" label="Examination adequacy" bind:value={d.examinationAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited-body-habitus">Limited (body habitus)</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>
</Fieldset>
