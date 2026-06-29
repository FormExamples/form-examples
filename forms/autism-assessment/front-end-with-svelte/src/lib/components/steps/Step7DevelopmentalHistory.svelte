<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const dh = assessment.data.developmentalHistory;
</script>

<Fieldset legend="Developmental History">
	<p class="hint">Early developmental milestones and behaviors.</p>

	<Field label="Language milestones" inputId="languageMilestones">
		<TextAreaInput id="languageMilestones" label="Language milestones" rows={3} bind:value={dh.languageMilestones} />
	</Field>

	<Field label="Motor milestones" inputId="motorMilestones">
		<TextAreaInput id="motorMilestones" label="Motor milestones" rows={3} bind:value={dh.motorMilestones} />
	</Field>

	<Field label="Early social behavior" inputId="earlySocialBehavior">
		<TextAreaInput id="earlySocialBehavior" label="Early social behavior" rows={3} bind:value={dh.earlySocialBehavior} />
	</Field>

	<Field label="Any developmental concerns" inputId="developmentalConcerns">
		<TextAreaInput id="developmentalConcerns" label="Developmental concerns" rows={3} bind:value={dh.developmentalConcerns} />
	</Field>
</Fieldset>
