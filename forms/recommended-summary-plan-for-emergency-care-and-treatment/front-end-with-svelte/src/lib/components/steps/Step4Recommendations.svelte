<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.recommendations;
</script>

<Fieldset legend="Step 4 of 9 — Clinical recommendations">
	<p class="hint">Agreed recommendations on the balance between sustaining life and comfort.</p>

	<Field
		label="Balance of priorities"
		description="Where, on balance, care should be focused."
		required
		inputId="recommendations-priorityBalance"
	>
		<Select
			id="recommendations-priorityBalance"
			label="Balance of priorities"
			required
			bind:value={r.priorityBalance}
		>
			<option value="">— Select —</option>
			<option value="sustain-life">Prioritise sustaining life</option>
			<option value="balanced">Balanced — weigh both</option>
			<option value="comfort">Prioritise comfort</option>
		</Select>
	</Field>

	<Field label="Recommended interventions" inputId="recommendations-recommendedInterventions">
		<TextAreaInput
			id="recommendations-recommendedInterventions"
			label="Recommended interventions"
			rows={3}
			placeholder="Realistic interventions that are recommended."
			bind:value={r.recommendedInterventions}
		/>
	</Field>

	<Field
		label="Not-recommended interventions"
		inputId="recommendations-notRecommendedInterventions"
	>
		<TextAreaInput
			id="recommendations-notRecommendedInterventions"
			label="Not-recommended interventions"
			rows={3}
			placeholder="Interventions that are not recommended."
			bind:value={r.notRecommendedInterventions}
		/>
	</Field>
</Fieldset>
