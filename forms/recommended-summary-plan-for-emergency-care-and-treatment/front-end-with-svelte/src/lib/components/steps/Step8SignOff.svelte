<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.signOff;
</script>

<Fieldset legend="Step 8 of 9 — Clinician sign-off">
	<p class="hint">The completing clinician signs and dates the plan for it to be valid.</p>

	<Field label="Clinician name" required inputId="signOff-clinicianName">
		<TextInput
			id="signOff-clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr A. Okafor"
			required
			bind:value={s.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="signOff-clinicianRole">
		<Select id="signOff-clinicianRole" label="Clinician role" required bind:value={s.clinicianRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="paramedic">Paramedic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration (GMC / NMC / HCPC)" inputId="signOff-clinicianRegistration">
		<TextInput
			id="signOff-clinicianRegistration"
			label="Registration"
			placeholder="e.g. GMC 7654321"
			bind:value={s.clinicianRegistration}
		/>
	</Field>

	<Field label="Signature" required inputId="signOff-signature">
		<TextInput
			id="signOff-signature"
			label="Signature"
			placeholder="Type your full name to sign"
			required
			bind:value={s.signature}
		/>
	</Field>

	<Field label="Date and time signed" required inputId="signOff-signedAt">
		<TextInput
			id="signOff-signedAt"
			label="Date and time signed"
			type="datetime-local"
			class="date-input"
			required
			bind:value={s.signedAt}
		/>
	</Field>

	<Field label="Senior clinician endorsement" inputId="signOff-seniorEndorsement">
		<TextAreaInput
			id="signOff-seniorEndorsement"
			label="Senior clinician endorsement"
			rows={2}
			placeholder="Senior endorsement, if applicable."
			bind:value={s.seniorEndorsement}
		/>
	</Field>

	<Field label="Emergency contacts" inputId="signOff-emergencyContacts">
		<TextAreaInput
			id="signOff-emergencyContacts"
			label="Emergency contacts"
			rows={2}
			placeholder="Contacts to notify in an emergency."
			bind:value={s.emergencyContacts}
		/>
	</Field>

	<Field
		label="Planned review date"
		description="A review date in the past raises a governance flag."
		inputId="signOff-reviewDate"
	>
		<DateInput id="signOff-reviewDate" label="Planned review date" bind:value={s.reviewDate} />
	</Field>
</Fieldset>
