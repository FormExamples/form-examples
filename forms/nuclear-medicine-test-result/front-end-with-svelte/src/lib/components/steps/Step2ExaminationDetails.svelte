<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, radiopharmaceutical, injected activity, and adequacy.</p>

	<Field label="Scan type" inputId="scanType" required>
		<Select id="scanType" label="Scan type" bind:value={d.scanType} required>
			<option value="">Select…</option>
			<option value="bone-scan">Bone scan</option>
			<option value="myocardial-perfusion">Myocardial perfusion</option>
			<option value="vq-lung-scan">V/Q lung scan</option>
			<option value="thyroid-uptake">Thyroid uptake</option>
			<option value="renal-dmsa">Renal DMSA</option>
			<option value="renal-mag3">Renal MAG3</option>
			<option value="gallium-octreotide">Gallium / octreotide</option>
			<option value="white-cell-scan">White-cell scan</option>
			<option value="sentinel-node">Sentinel node</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Radiopharmaceutical" inputId="radiopharmaceutical">
		<TextInput
			id="radiopharmaceutical"
			label="Radiopharmaceutical"
			placeholder="e.g. Tc-99m MDP, Tc-99m MAA, Tc-99m sestamibi, Ga-68 DOTATATE"
			bind:value={d.radiopharmaceutical}
		/>
	</Field>

	<Field
		label="Injected activity (MBq)"
		inputId="injectedActivityMbq"
		description="Administered activity in megabecquerels, for dose audit (DRL comparison)."
	>
		<NumberInput
			id="injectedActivityMbq"
			label="Injected activity (MBq)"
			min={0}
			max={100000}
			step={0.1}
			bind:value={d.injectedActivityMbq}
		/>
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
