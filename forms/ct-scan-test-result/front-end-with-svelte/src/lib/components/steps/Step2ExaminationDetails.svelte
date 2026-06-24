<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, contrast, technique, and adequacy.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="head">Head</option>
			<option value="neck">Neck</option>
			<option value="chest">Chest</option>
			<option value="abdomen">Abdomen</option>
			<option value="pelvis">Pelvis</option>
			<option value="abdomen-pelvis">Abdomen / pelvis</option>
			<option value="spine">Spine</option>
			<option value="ct-angiogram">CT angiogram</option>
			<option value="ct-colonography">CT colonography</option>
			<option value="whole-body">Whole body</option>
			<option value="extremity">Extremity</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Contrast used" inputId="contrastUsed">
		<Select id="contrastUsed" label="Contrast used" bind:value={d.contrastUsed}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="iv-iodinated">IV iodinated</option>
			<option value="oral">Oral</option>
			<option value="both">Both</option>
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

	<Field label="Technique" inputId="technique">
		<TextAreaInput
			id="technique"
			label="Technique"
			rows={3}
			placeholder="Phases, scan parameters, reconstructions, protocol deviations…"
			bind:value={d.technique}
		/>
	</Field>
</Fieldset>
