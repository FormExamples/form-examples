<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const d = assessment.data.psychologicalReadiness;

	const yesNo: { key: keyof typeof d; label: string }[] = [
		{ key: 'understandsProcedure', label: 'Understands procedure' },
		{ key: 'understandsRisks', label: 'Understands risks' },
		{ key: 'voluntaryDecision', label: 'Voluntary decision' },
		{ key: 'supportNetwork', label: 'Has support network' },
		{ key: 'donorAdvocateConsulted', label: 'Donor advocate consulted' },
		{ key: 'previousPsychologicalIssues', label: 'Previous psychological issues' }
	];
</script>

<Fieldset legend="Psychological Readiness">
	<p class="hint">Donor understanding, motivation, and support.</p>

	<div class="grid">
		{#each yesNo as q (q.key)}
			<Field label={q.label} inputId={String(q.key)}>
				<Select id={String(q.key)} label={q.label} bind:value={d[q.key] as string}>
					<option value="">Select…</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</Select>
			</Field>
		{/each}
	</div>

	<Field label="Coercion Concerns" inputId="coercionConcerns">
		<Select id="coercionConcerns" label="Coercion Concerns" bind:value={d.coercionConcerns}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.coercionConcerns === 'yes'}
		<Field label="Coercion details" inputId="coercionDetails">
			<TextInput id="coercionDetails" label="Coercion details" bind:value={d.coercionDetails} />
		</Field>
	{/if}

	{#if d.previousPsychologicalIssues === 'yes'}
		<Field label="Psychological issue details" inputId="psychologicalIssueDetails">
			<TextInput id="psychologicalIssueDetails" label="Psychological issue details" bind:value={d.psychologicalIssueDetails} />
		</Field>
	{/if}

	<div class="grid">
		<Field label="Anxiety About Procedure" inputId="anxietyAboutProcedure">
			<Select id="anxietyAboutProcedure" label="Anxiety About Procedure" bind:value={d.anxietyAboutProcedure}>
				<option value="">Select…</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="Time Off Work Arranged" inputId="timeOffWorkArranged">
			<Select id="timeOffWorkArranged" label="Time Off Work Arranged" bind:value={d.timeOffWorkArranged}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="not-applicable">Not applicable</option>
			</Select>
		</Field>
		<Field label="Willing to Proceed" inputId="willingToProceed">
			<Select id="willingToProceed" label="Willing to Proceed" bind:value={d.willingToProceed}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="undecided">Undecided</option>
			</Select>
		</Field>
	</div>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
