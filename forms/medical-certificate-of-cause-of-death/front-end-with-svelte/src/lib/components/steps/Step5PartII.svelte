<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.partII;
</script>

<Fieldset legend="Step 5 of 6 — Part II: contributory conditions">
	<p class="hint">
		Other significant conditions that contributed to the death but were not part of the direct Part
		I sequence.
	</p>

	<Field label="Contributory conditions" inputId="partII-partIiConditions">
		<TextAreaInput
			id="partII-partIiConditions"
			label="Contributory conditions"
			rows={3}
			placeholder="Other significant conditions contributing to death."
			bind:value={p.partIiConditions}
		/>
	</Field>

	<Field label="Interval (optional)" inputId="partII-partIiInterval">
		<TextInput
			id="partII-partIiInterval"
			label="Interval (optional)"
			placeholder="e.g. 20 years"
			bind:value={p.partIiInterval}
		/>
	</Field>
</Fieldset>
