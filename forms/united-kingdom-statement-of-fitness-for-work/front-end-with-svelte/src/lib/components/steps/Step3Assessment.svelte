<script lang="ts">
	import { store } from '#lib/stores/fitnote.svelte.js';
	import { ASSESSMENT_METHODS } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import YesNo from '#lib/components/ui/YesNo.svelte';

	const d = store.data;
</script>

<Fieldset legend="Assessment">
	<p class="hint">When and how the patient was assessed.</p>

	<div class="field-grid">
		<Field label="Assessment date" inputId="assessment-date">
			<DateInput id="assessment-date" label="Assessment date" bind:value={d.assessmentDate} />
		</Field>
		<Field label="Assessment method" inputId="assessment-method">
			<Select id="assessment-method" label="Assessment method" bind:value={d.assessmentMethod}>
				<option value="">—</option>
				{#each ASSESSMENT_METHODS as m (m.value)}
					<option value={m.value}>{m.label}</option>
				{/each}
			</Select>
		</Field>
	</div>

	<Field
		label="General fitness considered?"
		description="DWP guidance: consider the impact of the condition on overall ability to work, not just on a specific task."
	>
		<YesNo
			label="General fitness considered?"
			name="generalFitnessConsidered"
			bind:value={d.generalFitnessConsidered}
		/>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
