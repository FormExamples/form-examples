<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const r = assessment.data.referrer;
</script>

<Fieldset legend="Step 1 of 9 — Referrer details">
	<p class="hint">Who is making this referral, and how the receiving service can contact you.</p>

	<Field label="Your name" required inputId="referrer-referrerName">
		<TextInput
			id="referrer-referrerName"
			label="Your name"
			placeholder="e.g. Dr Priya Nair"
			required
			bind:value={r.referrerName}
		/>
	</Field>

	<Field label="Your role" required inputId="referrer-referrerRole">
		<Select id="referrer-referrerRole" label="Your role" required bind:value={r.referrerRole}>
			<option value="">— Select —</option>
			<option value="gp">GP</option>
			<option value="gp-registrar">GP registrar</option>
			<option value="nurse-practitioner">Nurse practitioner</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="paramedic">Paramedic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="GMC / NMC / GPhC registration number" inputId="referrer-referrerRegistrationNumber">
		<TextInput
			id="referrer-referrerRegistrationNumber"
			label="GMC / NMC / GPhC registration number"
			placeholder="e.g. 7654321"
			bind:value={r.referrerRegistrationNumber}
		/>
	</Field>

	<Field label="Referring practice" required inputId="referrer-referringPractice">
		<TextInput
			id="referrer-referringPractice"
			label="Referring practice"
			placeholder="e.g. Elm Park Surgery"
			required
			bind:value={r.referringPractice}
		/>
	</Field>

	<Field label="Practice address" inputId="referrer-practiceAddress">
		<TextAreaInput
			id="referrer-practiceAddress"
			label="Practice address"
			rows={2}
			placeholder="Practice postal address"
			bind:value={r.practiceAddress}
		/>
	</Field>

	<Field label="Contact (phone or secure email)" inputId="referrer-referrerContact">
		<TextInput
			id="referrer-referrerContact"
			label="Contact (phone or secure email)"
			placeholder="e.g. 020 7946 0100 / elmpark@nhs.net"
			bind:value={r.referrerContact}
		/>
	</Field>

	<Field label="Date of referral" inputId="referrer-referralDate">
		<DateInput id="referrer-referralDate" label="Date of referral" bind:value={r.referralDate} />
	</Field>
</Fieldset>
