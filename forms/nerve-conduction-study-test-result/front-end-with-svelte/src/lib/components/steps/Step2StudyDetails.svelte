<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Study Details">
	<p class="hint">The performed study type, region, laterality, and adequacy.</p>

	<Field label="Study type" inputId="studyType" required>
		<Select id="studyType" label="Study type" bind:value={d.studyType} required>
			<option value="">Select…</option>
			<option value="nerve-conduction">Nerve conduction</option>
			<option value="emg">Needle EMG</option>
			<option value="nerve-conduction-and-emg">Nerve conduction and EMG</option>
			<option value="repetitive-stimulation">Repetitive stimulation</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Region" inputId="region" required>
		<Select id="region" label="Region" bind:value={d.region} required>
			<option value="">Select…</option>
			<option value="upper-limb">Upper limb</option>
			<option value="lower-limb">Lower limb</option>
			<option value="all-limbs">All limbs</option>
			<option value="cranial">Cranial</option>
			<option value="generalised">Generalised</option>
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

	<Field label="Study adequacy" inputId="studyAdequacy">
		<Select id="studyAdequacy" label="Study adequacy" bind:value={d.studyAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>
</Fieldset>
