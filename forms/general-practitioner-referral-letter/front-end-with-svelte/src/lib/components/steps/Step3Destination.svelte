<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.destination;
</script>

<Fieldset legend="Step 3 of 9 — Referral destination">
	<p class="hint">Where the referral is going.</p>

	<Field label="Referral specialty / service" required inputId="destination-referralSpecialty">
		<TextInput
			id="destination-referralSpecialty"
			label="Referral specialty / service"
			placeholder="e.g. Gastroenterology"
			required
			bind:value={d.referralSpecialty}
		/>
	</Field>

	<Field label="Named clinician or team" inputId="destination-namedClinician">
		<TextInput
			id="destination-namedClinician"
			label="Named clinician or team"
			placeholder="e.g. Dr Osei, Lower GI team"
			bind:value={d.namedClinician}
		/>
	</Field>

	<Field label="Receiving organisation" inputId="destination-receivingOrganisation">
		<TextInput
			id="destination-receivingOrganisation"
			label="Receiving organisation"
			placeholder="e.g. St Mary’s NHS Foundation Trust"
			bind:value={d.receivingOrganisation}
		/>
	</Field>
</Fieldset>
