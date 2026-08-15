<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, contrast, pulse sequences, and adequacy.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="brain">Brain</option>
			<option value="spine-cervical">Spine — cervical</option>
			<option value="spine-thoracic">Spine — thoracic</option>
			<option value="spine-lumbar">Spine — lumbar</option>
			<option value="head-neck">Head / neck</option>
			<option value="chest">Chest</option>
			<option value="abdomen">Abdomen</option>
			<option value="pelvis">Pelvis</option>
			<option value="cardiac">Cardiac</option>
			<option value="mr-angiogram">MR angiogram</option>
			<option value="breast">Breast</option>
			<option value="musculoskeletal-joint">Musculoskeletal joint</option>
			<option value="whole-body">Whole body</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Contrast used" inputId="contrastUsed">
		<Select id="contrastUsed" label="Contrast used" bind:value={d.contrastUsed}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="iv-gadolinium">IV gadolinium</option>
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

	<Field label="Sequences performed" inputId="sequencesPerformed">
		<TextAreaInput
			id="sequencesPerformed"
			label="Sequences performed"
			rows={3}
			placeholder="Pulse sequences and protocol performed (e.g. T1, T2, FLAIR, DWI, DCE), with any deviations…"
			bind:value={d.sequencesPerformed}
		/>
	</Field>
</Fieldset>
