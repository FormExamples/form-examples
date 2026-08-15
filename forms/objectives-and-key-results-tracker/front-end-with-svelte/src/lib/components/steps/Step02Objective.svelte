<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="2. Objective" data-step="2">
	<Field label="Title" inputId="objTitle" required>
		<TextInput id="objTitle" label="Title" bind:value={d.objective.obj_title} required />
	</Field>

	<Field label="Long description" inputId="objLongDescription">
		<TextAreaInput
			id="objLongDescription"
			label="Long description"
			rows={3}
			bind:value={d.objective.obj_long_description}
		/>
	</Field>

	<Field label="Strategic theme" inputId="strategicTheme">
		<TextInput id="strategicTheme" label="Strategic theme" bind:value={d.objective.strategic_theme} />
	</Field>

	<Field label="Parent objective ID" inputId="parentObjectiveId">
		<TextInput
			id="parentObjectiveId"
			label="Parent objective ID"
			bind:value={d.objective.parent_objective_id}
		/>
	</Field>
</Fieldset>
