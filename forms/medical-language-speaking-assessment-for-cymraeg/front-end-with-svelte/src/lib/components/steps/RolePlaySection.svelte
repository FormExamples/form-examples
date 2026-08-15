<script lang="ts">
	import type { RolePlayContext } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	let {
		section,
		legend,
		description,
		idPrefix,
		examples
	}: {
		/** The reactive role-play section to bind to (mutated in place). */
		section: RolePlayContext;
		legend: string;
		description: string;
		idPrefix: string;
		examples: { title: string; summary: string; patientRole: string; setting: string };
	} = $props();

	const criticalityOptions = [
		{ value: 'low', label: 'Low — routine, non-urgent' },
		{ value: 'standard', label: 'Standard — typical clinical encounter' },
		{ value: 'high', label: 'High — urgent, high-stakes, or breaking bad news' }
	];
</script>

<Fieldset {legend}>
	<p class="hint">{description}</p>

	<Field label="Scenario title" required inputId={`${idPrefix}ScenarioTitle`}>
		<TextInput
			id={`${idPrefix}ScenarioTitle`}
			label="Scenario title"
			required
			placeholder={examples.title}
			bind:value={section.scenarioTitle}
		/>
	</Field>

	<Field label="Scenario summary" inputId={`${idPrefix}ScenarioSummary`}>
		<TextAreaInput
			id={`${idPrefix}ScenarioSummary`}
			label="Scenario summary"
			rows={3}
			placeholder={examples.summary}
			bind:value={section.scenarioSummary}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Patient (interlocutor) role" inputId={`${idPrefix}PatientRole`}>
			<TextInput
				id={`${idPrefix}PatientRole`}
				label="Patient role"
				placeholder={examples.patientRole}
				bind:value={section.patientRole}
			/>
		</Field>
		<Field label="Clinical setting" inputId={`${idPrefix}Setting`}>
			<TextInput
				id={`${idPrefix}Setting`}
				label="Clinical setting"
				placeholder={examples.setting}
				bind:value={section.setting}
			/>
		</Field>
	</div>

	<Field label="Safety-criticality of the scenario">
		<fieldset class="radio-group" role="radiogroup" aria-label="Safety-criticality of the scenario">
			{#each criticalityOptions as opt (opt.value)}
				<label class="radio-row">
					<input
						type="radio"
						class="radio-input"
						name={`${idPrefix}SafetyCriticality`}
						value={opt.value}
						bind:group={section.safetyCriticality}
					/>
					{opt.label}
				</label>
			{/each}
		</fieldset>
	</Field>

	<Field label="Examiner notes for this role-play" inputId={`${idPrefix}ExaminerNotes`}>
		<TextAreaInput
			id={`${idPrefix}ExaminerNotes`}
			label="Examiner notes"
			rows={4}
			placeholder="Observations during the Welsh-language role-play (rapport, structure, language lapses, mutations / treigladau, dialect register, recovery from breakdowns…)"
			bind:value={section.examinerNotes}
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
	.radio-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
