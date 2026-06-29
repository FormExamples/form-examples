<script lang="ts">
	import { store } from '$lib/stores/checklist.svelte.js';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const c = store.data;

	function signOff() {
		if (!c.signOutCompletedAt) c.signOutCompletedAt = new Date().toISOString();
		if (!c.caseEndAt) c.caseEndAt = new Date().toISOString();
	}
	function clearSignOff() {
		c.signOutCompletedAt = '';
	}
</script>

<Fieldset legend="Step 4 — Sign Out (before leaving OR)">
	<p class="hint">
		Before the patient leaves the operating room. Required: nurse, anaesthetist, surgeon.
	</p>

	<Field label="1. Nurse verbally confirms: name of the procedure recorded">
		<RadioGroup label="Name of the procedure recorded">
			<label
				><input type="radio" class="radio-input" name="soProcedure" value="yes" bind:group={c.signOutProcedureNameConfirmed} /> Confirmed</label
			>
		</RadioGroup>
	</Field>

	<Field label="2. Nurse verbally confirms: instrument, sponge, and needle counts">
		<RadioGroup label="Instrument, sponge, and needle counts">
			<label
				><input type="radio" class="radio-input" name="soCounts" value="yes" bind:group={c.signOutCountsConfirmed} /> Yes</label
			>
			<label
				><input type="radio" class="radio-input" name="soCounts" value="no" bind:group={c.signOutCountsConfirmed} /> No</label
			>
		</RadioGroup>
	</Field>

	<Field label="3. Nurse verbally confirms: specimen labelling (read aloud, including patient name)">
		<RadioGroup label="Specimen labelling confirmed">
			<label
				><input type="radio" class="radio-input" name="soSpecimens" value="yes" bind:group={c.signOutSpecimensLabelled} /> Yes</label
			>
			<label
				><input type="radio" class="radio-input" name="soSpecimens" value="no" bind:group={c.signOutSpecimensLabelled} /> No</label
			>
			<label
				><input type="radio" class="radio-input" name="soSpecimens" value="not-applicable" bind:group={c.signOutSpecimensLabelled} /> N/A</label
			>
		</RadioGroup>
	</Field>

	<Field label="4. Equipment problems to be addressed" inputId="soEquipment">
		<TextAreaInput id="soEquipment" label="Equipment problems to be addressed" rows={2} bind:value={c.signOutEquipmentProblems} />
	</Field>

	<Field label="5. Key concerns for recovery and management of this patient" inputId="soRecovery">
		<TextAreaInput id="soRecovery" label="Key concerns for recovery" rows={2} bind:value={c.signOutRecoveryConcerns} />
	</Field>

	<h3 class="mt-6 mb-2 text-lg font-semibold text-base-content">Sign Out coordinator sign-off</h3>

	<Field label="Coordinator name" inputId="signOutCoordinatorName">
		<TextInput id="signOutCoordinatorName" label="Coordinator name" bind:value={c.signOutCoordinatorName} />
	</Field>

	<Field label="Coordinator role" inputId="signOutCoordinatorRole">
		<Select id="signOutCoordinatorRole" label="Coordinator role" bind:value={c.signOutCoordinatorRole}>
			<option value="">-- Select --</option>
			<option value="circulating-nurse">Circulating nurse</option>
			<option value="anaesthetist">Anaesthetist</option>
			<option value="surgeon">Surgeon</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<div class="mt-3 flex items-center gap-3">
		<Button data-variant="primary" onclick={signOff}>Sign Sign-Out now (records wheels-out time)</Button>
		{#if c.signOutCompletedAt}
			<span class="text-sm text-base-content/70">Signed at <code>{c.signOutCompletedAt}</code></span>
			<Button data-variant="secondary" onclick={clearSignOff}>Clear</Button>
		{/if}
	</div>
</Fieldset>
