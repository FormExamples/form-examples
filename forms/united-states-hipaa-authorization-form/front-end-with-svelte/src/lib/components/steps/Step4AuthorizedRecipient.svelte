<script lang="ts">
	import { authorization } from '$lib/stores/authorization.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const d = authorization.data.authorizedRecipient;
</script>

<Fieldset legend="Authorized recipient">
	<p class="hint">Who will receive the information?</p>

	<Field label="Recipient name" required inputId="authorizedRecipient-recipientName">
		<TextInput id="authorizedRecipient-recipientName" label="Recipient name" required bind:value={d.recipientName} />
	</Field>

	<Field label="Recipient organisation" inputId="authorizedRecipient-recipientOrganization">
		<TextInput id="authorizedRecipient-recipientOrganization" label="Recipient organisation" bind:value={d.recipientOrganization} />
	</Field>

	<Field label="Recipient address" inputId="authorizedRecipient-recipientAddress">
		<TextInput id="authorizedRecipient-recipientAddress" label="Recipient address" bind:value={d.recipientAddress} />
	</Field>

	<Field label="Phone" inputId="authorizedRecipient-recipientPhone">
		<TextInput id="authorizedRecipient-recipientPhone" label="Phone" bind:value={d.recipientPhone} />
	</Field>

	<Field label="Email" inputId="authorizedRecipient-recipientEmail">
		<TextInput id="authorizedRecipient-recipientEmail" label="Email" bind:value={d.recipientEmail} />
	</Field>
</Fieldset>
