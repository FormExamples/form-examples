<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen">
	<p class="hint">The cultured specimen, its anatomical source, and its condition on receipt.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType} required>
			<option value="">Select…</option>
			<option value="blood-culture">Blood culture</option>
			<option value="urine">Urine</option>
			<option value="wound-swab">Wound swab</option>
			<option value="sputum">Sputum</option>
			<option value="throat-swab">Throat swab</option>
			<option value="stool">Stool</option>
			<option value="csf">CSF</option>
			<option value="tissue">Tissue</option>
			<option value="catheter-tip">Catheter tip</option>
			<option value="genital-swab">Genital swab</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen site detail" inputId="specimenSiteDetail">
		<TextInput
			id="specimenSiteDetail"
			label="Specimen site detail"
			placeholder="e.g. Midstream urine; left leg wound"
			bind:value={d.specimenSiteDetail}
		/>
	</Field>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="contaminated">Contaminated</option>
			<option value="insufficient">Insufficient</option>
			<option value="delayed">Delayed</option>
		</Select>
	</Field>
</Fieldset>
