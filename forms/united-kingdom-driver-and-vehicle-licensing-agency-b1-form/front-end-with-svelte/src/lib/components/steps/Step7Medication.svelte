<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Question 7 — Medication">
	<p class="hint">Please list any medication that you take or have taken for this condition. If you take none, tick the box below.</p>

	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="noMedicationTaken" bind:checked={m.noMedicationTaken} />
		<span>No medication taken</span>
	</label>

	{#if !m.noMedicationTaken}
		{#each m.entries as entry, i (i)}
			<div class="medication-card">
				<h4 class="medication-title">Medication {i + 1}</h4>
				<Field label="Name of medication" inputId={`medName${i}`}>
					<TextInput id={`medName${i}`} label="Name of medication" placeholder="e.g. Levetiracetam 500mg twice daily" bind:value={entry.name} />
				</Field>
				<div class="field-grid">
					<Field label="Start date" inputId={`medStart${i}`}>
						<DateInput id={`medStart${i}`} label="Start date" bind:value={entry.startDate} />
					</Field>
					<Field label="End date (leave blank if ongoing)" inputId={`medEnd${i}`}>
						<DateInput id={`medEnd${i}`} label="End date" bind:value={entry.endDate} />
					</Field>
				</div>
			</div>
		{/each}

		<Field label="a) Does your medication make you drowsy or confused when driving?" required>
			<RadioGroup label="Drowsy?">
				<label><input type="radio" class="radio-input" name="medMakesDrowsy" value="yes" bind:group={m.makesDrowsyOrConfused} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="medMakesDrowsy" value="no" bind:group={m.makesDrowsyOrConfused} required /> No</label>
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.checkbox-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		background: var(--color-surface);
		margin: 0 0 0.75rem;
		cursor: pointer;
	}
	.medication-card {
		padding: 0.75rem 1rem;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		margin: 0 0 0.75rem;
	}
	.medication-title {
		font-size: 0.9375rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
