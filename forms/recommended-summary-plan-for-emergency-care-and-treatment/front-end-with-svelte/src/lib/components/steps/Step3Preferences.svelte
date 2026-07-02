<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const pr = assessment.data.preferences;
</script>

<Fieldset legend="Step 3 of 9 — Preferences and what matters">
	<p class="hint">What the person values, and their priorities and fears for their care.</p>

	<Field
		label="What matters to the person"
		description="Values, priorities, and fears. Record here or under care preferences."
		inputId="preferences-whatMatters"
	>
		<TextAreaInput
			id="preferences-whatMatters"
			label="What matters to the person"
			rows={3}
			placeholder="e.g. Wishes to remain at home; fears breathlessness."
			bind:value={pr.whatMatters}
		/>
	</Field>

	<Field label="Preferences for care" inputId="preferences-carePreferences">
		<TextAreaInput
			id="preferences-carePreferences"
			label="Preferences for care"
			rows={3}
			placeholder="e.g. Comfort-focused care; avoid hospital where possible."
			bind:value={pr.carePreferences}
		/>
	</Field>
</Fieldset>
