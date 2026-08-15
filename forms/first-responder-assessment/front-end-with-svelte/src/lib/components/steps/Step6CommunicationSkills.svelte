<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.communicationSkills;
	const competency = [
		{ value: 'not-competent', label: 'Not Competent' },
		{ value: 'developing', label: 'Developing' },
		{ value: 'competent', label: 'Competent' },
		{ value: 'expert', label: 'Expert' }
	];
</script>

<Fieldset legend="Communication Skills">
	<p class="hint">Interpersonal, handover, documentation, and safeguarding competencies.</p>

	<div class="field-grid">
		<Field label="Patient communication" inputId="patientCommunication">
			<Select id="patientCommunication" label="Patient communication" bind:value={c.patientCommunication}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Relative communication" inputId="relativeCommunication">
			<Select id="relativeCommunication" label="Relative communication" bind:value={c.relativeCommunication}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Handover competency" inputId="handoverCompetency">
			<Select id="handoverCompetency" label="Handover competency" bind:value={c.handoverCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Documentation competency" inputId="documentationCompetency">
			<Select id="documentationCompetency" label="Documentation competency" bind:value={c.documentationCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Multidisciplinary teamwork" inputId="multidisciplinaryTeamwork">
			<Select id="multidisciplinaryTeamwork" label="Multidisciplinary teamwork" bind:value={c.multidisciplinaryTeamwork}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Conflict resolution" inputId="conflictResolution">
			<Select id="conflictResolution" label="Conflict resolution" bind:value={c.conflictResolution}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Safeguarding awareness" inputId="safeguardingAwareness">
			<Select id="safeguardingAwareness" label="Safeguarding awareness" bind:value={c.safeguardingAwareness}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Breaking bad news" inputId="breakingBadNews">
			<Select id="breakingBadNews" label="Breaking bad news" bind:value={c.breakingBadNews}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Communication notes" inputId="communicationNotes">
		<TextAreaInput id="communicationNotes" label="Communication notes" rows={3} bind:value={c.communicationNotes} />
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
