<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="6. Initiatives" data-step="6">
	<Field label="Initiatives" inputId="inInitiatives">
		<TextAreaInput
			id="inInitiatives"
			label="Initiatives"
			rows={3}
			bind:value={d.initiatives.in_initiatives}
		/>
	</Field>

	<Field label="Supporting links" inputId="inSupportingLinks">
		<TextAreaInput
			id="inSupportingLinks"
			label="Supporting links"
			rows={3}
			bind:value={d.initiatives.in_supporting_links}
		/>
	</Field>
</Fieldset>
