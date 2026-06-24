<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, laterality, projections, and adequacy.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="chest">Chest</option>
			<option value="abdomen">Abdomen</option>
			<option value="spine-cervical">Spine — cervical</option>
			<option value="spine-thoracic">Spine — thoracic</option>
			<option value="spine-lumbar">Spine — lumbar</option>
			<option value="pelvis">Pelvis</option>
			<option value="hip">Hip</option>
			<option value="knee">Knee</option>
			<option value="ankle-foot">Ankle / foot</option>
			<option value="shoulder">Shoulder</option>
			<option value="wrist-hand">Wrist / hand</option>
			<option value="skull">Skull</option>
			<option value="dental">Dental</option>
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
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>

	<Field label="Projections / technique" inputId="projections">
		<TextAreaInput
			id="projections"
			label="Projections / technique"
			rows={3}
			placeholder="Views acquired (e.g. PA and lateral, AP, oblique) and any technique notes…"
			bind:value={d.projections}
		/>
	</Field>
</Fieldset>
