<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="6. Family History">
	<p class="hint">Premature cardiac events and other hereditary conditions in the immediate family.</p>

	<Field
		label="Premature heart attack or stroke (before age 60) in a first-degree relative"
		inputId="familyHistory-familyHistoryPrematureCardiacEvent"
	>
		<Select
			id="familyHistory-familyHistoryPrematureCardiacEvent"
			label="Premature heart attack or stroke (before age 60) in a first-degree relative"
			bind:value={d.familyHistory.familyHistoryPrematureCardiacEvent}
		>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other hereditary conditions" inputId="familyHistory-familyHistoryOther">
		<TextAreaInput id="familyHistory-familyHistoryOther" label="Other hereditary conditions" rows={2} bind:value={d.familyHistory.familyHistoryOther} />
	</Field>
</Fieldset>
