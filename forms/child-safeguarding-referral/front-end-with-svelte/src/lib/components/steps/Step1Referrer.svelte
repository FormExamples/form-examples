<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const r = assessment.data.referrer;
</script>

<Fieldset legend="Step 1 of 9 — Referrer details">
	<p class="hint">
		Who is making this referral, and how children’s social care can contact you.
	</p>

	<Field label="Your name" required inputId="referrer-referrerName">
		<TextInput
			id="referrer-referrerName"
			label="Your name"
			placeholder="e.g. Sarah Ahmed"
			required
			bind:value={r.referrerName}
		/>
	</Field>

	<Field label="Your role / job title" inputId="referrer-referrerRole">
		<TextInput
			id="referrer-referrerRole"
			label="Your role / job title"
			placeholder="e.g. Designated Safeguarding Lead"
			bind:value={r.referrerRole}
		/>
	</Field>

	<Field label="Organisation" inputId="referrer-referrerOrganisation">
		<TextInput
			id="referrer-referrerOrganisation"
			label="Organisation"
			placeholder="e.g. Oakfield Primary School"
			bind:value={r.referrerOrganisation}
		/>
	</Field>

	<Field
		label="Contact phone"
		description="A phone number OR an email is required so the duty team can reach you."
		required
		inputId="referrer-referrerPhone"
	>
		<TextInput
			id="referrer-referrerPhone"
			label="Contact phone"
			type="tel"
			placeholder="e.g. 020 7946 0000"
			bind:value={r.referrerPhone}
		/>
	</Field>

	<Field label="Contact email" inputId="referrer-referrerEmail">
		<TextInput
			id="referrer-referrerEmail"
			label="Contact email"
			type="email"
			placeholder="e.g. s.ahmed@oakfield.sch.uk"
			bind:value={r.referrerEmail}
		/>
	</Field>

	<Field label="Date and time of referral" inputId="referrer-referredAt">
		<TextInput
			id="referrer-referredAt"
			label="Date and time of referral"
			type="datetime-local"
			bind:value={r.referredAt}
		/>
	</Field>

	<Field label="Your relationship to the child" inputId="referrer-relationshipToChild">
		<TextInput
			id="referrer-relationshipToChild"
			label="Your relationship to the child"
			placeholder="e.g. Class teacher"
			bind:value={r.relationshipToChild}
		/>
	</Field>
</Fieldset>
