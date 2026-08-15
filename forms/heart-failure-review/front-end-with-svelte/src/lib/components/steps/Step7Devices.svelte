<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const dv = assessment.data.devices;
</script>

<Fieldset legend="Step 7 of 9 — Devices and procedures">
	<p class="hint">Implanted cardiac devices and their check status.</p>

	<Field label="Implantable cardioverter-defibrillator (ICD)" inputId="devices-icd">
		<Select id="devices-icd" label="Implantable cardioverter-defibrillator (ICD)" bind:value={dv.icd}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Cardiac resynchronisation therapy (CRT)" inputId="devices-crt">
		<Select id="devices-crt" label="Cardiac resynchronisation therapy (CRT)" bind:value={dv.crt}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Pacemaker" inputId="devices-pacemaker">
		<Select id="devices-pacemaker" label="Pacemaker" bind:value={dv.pacemaker}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Device check status" inputId="devices-deviceCheckStatus">
		<Select
			id="devices-deviceCheckStatus"
			label="Device check status"
			bind:value={dv.deviceCheckStatus}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="overdue">Overdue</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>
</Fieldset>
