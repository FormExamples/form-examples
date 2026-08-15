<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const r = assessment.data.responderDetails;
</script>

<Fieldset
	title="Community First Aid Responder"
	description="Identification of the CFAR completing this form."
>
	<TextInput label="Name" name="responderName" bind:value={r.name} required />
	<TextInput
		label="Signature"
		name="responderSignature"
		bind:value={r.signature}
		placeholder="Type your name as signature"
		required
	/>
	<TextInput
		label="Contact information"
		name="responderContact"
		bind:value={r.contactInformation}
		placeholder="Phone, email, etc."
		required
	/>
	<TextInput
		label="CFAR organization"
		name="responderOrg"
		bind:value={r.cfarOrganization}
		required
	/>
</Fieldset>
