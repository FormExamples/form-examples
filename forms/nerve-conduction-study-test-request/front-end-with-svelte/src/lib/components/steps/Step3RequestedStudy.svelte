<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const s = request.data.study;
</script>

<Fieldset legend="3. Requested Study">
	<p class="hint">
		Study type, anatomical region, and laterality — drives the appropriateness and procedural-risk
		axes.
	</p>

	<Field label="Requested study type" inputId="studyType" required>
		<Select id="studyType" label="Requested study type" bind:value={s.studyType} required>
			<option value="">Select…</option>
			<option value="nerve-conduction">Nerve conduction</option>
			<option value="emg">Needle EMG</option>
			<option value="nerve-conduction-and-emg">Nerve conduction + EMG</option>
			<option value="repetitive-stimulation">Repetitive stimulation</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Anatomical region" inputId="region">
		<Select id="region" label="Anatomical region" bind:value={s.region}>
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
		<Select id="laterality" label="Laterality" bind:value={s.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={s.requestedByDate} />
	</Field>
</Fieldset>
