<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">Body region, laterality, and the primary indication — drives the appropriateness axis.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.bodyRegion} required>
			<option value="">Select…</option>
			<option value="chest">Chest</option>
			<option value="abdomen">Abdomen</option>
			<option value="spine-cervical">Spine (cervical)</option>
			<option value="spine-thoracic">Spine (thoracic)</option>
			<option value="spine-lumbar">Spine (lumbar)</option>
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

	<Field label="Laterality" inputId="laterality" required>
		<Select id="laterality" label="Laterality" bind:value={d.laterality} required>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="trauma-fracture">Trauma / fracture</option>
			<option value="chest-infection">Chest infection</option>
			<option value="suspected-pneumothorax">Suspected pneumothorax</option>
			<option value="foreign-body">Foreign body</option>
			<option value="joint-pain">Joint pain</option>
			<option value="arthritis">Arthritis</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="line-position-check">Line-position check</option>
			<option value="abdominal-obstruction">Abdominal obstruction</option>
			<option value="swallowed-object">Swallowed object</option>
			<option value="follow-up">Follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
