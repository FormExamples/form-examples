<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.triggers;
</script>

<Fieldset legend="Step 5 of 11 — Triggers">
	<p class="hint">Reported seizure triggers since the last review.</p>

	<Field label="Triggers" inputId="triggers-triggers">
		<TextAreaInput
			id="triggers-triggers"
			label="Triggers"
			rows={4}
			placeholder="Sleep deprivation, alcohol, stress, missed medication, photosensitivity, catamenial pattern, illness / fever."
			bind:value={t.triggers}
		/>
	</Field>
</Fieldset>
