<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const f = assessment.data.rightFoot;
</script>

<Fieldset legend="Step 3 of 5 — Right foot examination">
	<p class="hint">
		Sensory neuropathy, pedal pulses, deformity, callus, skin breakdown, active ulceration, and
		ulceration/amputation history for the right foot. A suspected Charcot foot is a
		limb-threatening emergency requiring urgent referral.
	</p>

	<Field label="Neuropathy status" inputId="rightFoot-neuropathyStatus">
		<Select id="rightFoot-neuropathyStatus" label="Neuropathy status" bind:value={f.neuropathyStatus}>
			<option value="">— Select —</option>
			<option value="sensate">Sensate (normal)</option>
			<option value="insensate">Insensate (loss of protective sensation)</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="Pedal pulses status" inputId="rightFoot-pulsesStatus">
		<Select id="rightFoot-pulsesStatus" label="Pedal pulses status" bind:value={f.pulsesStatus}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="diminished">Diminished</option>
			<option value="absent">Absent</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="Deformity" inputId="rightFoot-deformity">
		<Select id="rightFoot-deformity" label="Deformity" bind:value={f.deformity}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Callus" inputId="rightFoot-callus">
		<Select id="rightFoot-callus" label="Callus" bind:value={f.callus}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Skin breakdown" inputId="rightFoot-skinBreakdown">
		<Select id="rightFoot-skinBreakdown" label="Skin breakdown" bind:value={f.skinBreakdown}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Active ulcer" inputId="rightFoot-activeUlcer">
		<Select id="rightFoot-activeUlcer" label="Active ulcer" bind:value={f.activeUlcer}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Ulcer severity" inputId="rightFoot-ulcerSeverity">
		<Select id="rightFoot-ulcerSeverity" label="Ulcer severity" bind:value={f.ulcerSeverity}>
			<option value="">— Select —</option>
			<option value="superficial">Superficial</option>
			<option value="deep">Deep</option>
			<option value="infected">Infected</option>
			<option value="critical-ischaemia">Critical limb ischaemia</option>
		</Select>
	</Field>

	<Field label="Previous ulcer" inputId="rightFoot-previousUlcer">
		<Select id="rightFoot-previousUlcer" label="Previous ulcer" bind:value={f.previousUlcer}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Previous amputation" inputId="rightFoot-previousAmputation">
		<Select id="rightFoot-previousAmputation" label="Previous amputation" bind:value={f.previousAmputation}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="minor">Minor (toe / partial foot)</option>
			<option value="major">Major (below / above knee)</option>
		</Select>
	</Field>

	<Field label="Suspected Charcot foot" inputId="rightFoot-suspectedCharcot">
		<Select id="rightFoot-suspectedCharcot" label="Suspected Charcot foot" bind:value={f.suspectedCharcot}>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>
</Fieldset>
