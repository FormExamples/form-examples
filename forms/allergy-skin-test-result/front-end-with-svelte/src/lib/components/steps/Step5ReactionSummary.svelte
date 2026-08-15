<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="5. Reaction Summary">
	<p class="hint">
		Structured reaction summary. A positive reaction demonstrates sensitisation, not necessarily
		clinical allergy; confirm clinical relevance against the history.
	</p>

	<Field label="Structured reaction summary">
		<CheckboxGroup label="Structured reaction summary">
			<label><CheckboxInput label="Positive reactions" bind:checked={d.positiveReactions} /> Positive reactions</label>
			<label><CheckboxInput label="Clinically relevant sensitisation confirmed" bind:checked={d.sensitisationConfirmed} /> Clinically relevant sensitisation confirmed</label>
			<label><CheckboxInput label="Anaphylaxis during test" bind:checked={d.anaphylaxisDuringTest} /> Anaphylaxis during test</label>
			<label><CheckboxInput label="All allergens negative" bind:checked={d.allNegative} /> All allergens negative</label>
			<label><CheckboxInput label="Test invalid / non-interpretable" bind:checked={d.testInvalid} /> Test invalid / non-interpretable</label>
		</CheckboxGroup>
	</Field>

	{#if d.anaphylaxisDuringTest}
		<Alert type="error" heading="Critical event selected">
			<p>
				Anaphylaxis during the test auto-escalates the follow-up urgency to a critical alert. Ensure
				the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}

	{#if d.testInvalid}
		<Alert type="warning" heading="Invalid test selected">
			<p>An invalid / non-interpretable test classifies the result as inconclusive.</p>
		</Alert>
	{/if}
</Fieldset>
