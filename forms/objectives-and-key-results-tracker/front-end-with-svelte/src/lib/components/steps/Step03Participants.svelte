<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="3. Participants" data-step="3">
	<Field label="DRI" inputId="dri" description="Directly responsible individual.">
		<TextInput id="dri" label="DRI" bind:value={d.participants.dri} />
	</Field>

	<Field label="Contributors" inputId="contributors">
		<TextInput id="contributors" label="Contributors" bind:value={d.participants.contributors} />
	</Field>

	<Field label="Reviewers" inputId="reviewers">
		<TextInput id="reviewers" label="Reviewers" bind:value={d.participants.reviewers} />
	</Field>

	<Field label="Stakeholders" inputId="stakeholders">
		<TextInput id="stakeholders" label="Stakeholders" bind:value={d.participants.stakeholders} />
	</Field>
</Fieldset>
