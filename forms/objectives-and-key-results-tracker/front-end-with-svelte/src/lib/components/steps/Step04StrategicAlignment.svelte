<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="4. Strategic alignment" data-step="4">
	<Field label="Parent summary" inputId="saParentSummary">
		<TextAreaInput
			id="saParentSummary"
			label="Parent summary"
			rows={3}
			bind:value={d.alignment.sa_parent_summary}
		/>
	</Field>

	<Field label="Business value statement" inputId="saBusinessValueStatement">
		<TextAreaInput
			id="saBusinessValueStatement"
			label="Business value statement"
			rows={3}
			bind:value={d.alignment.sa_business_value_statement}
		/>
	</Field>
</Fieldset>
