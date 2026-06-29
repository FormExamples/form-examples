<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const d = assessment.data.dischargeMedications;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Discharge Medications">
	<p class="hint">Reconciled medication list at the point of discharge.</p>

	<h3 class="list-heading">Medications</h3>
	<p class="hint">Each medication should include name, dose, route, frequency, and duration.</p>
	<MedicationEntry bind:medications={d.medications} />

	<Field label="Medication reconciliation completed?">
		<RadioGroup label="Medication reconciliation completed?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="reconciliationCompleted" value={opt.value} bind:group={d.reconciliationCompleted} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Reconciliation notes" inputId="reconciliationNotes">
		<TextAreaInput
			id="reconciliationNotes"
			label="Reconciliation notes"
			rows={3}
			bind:value={d.reconciliationNotes}
			placeholder="Pre-admission medications stopped, started, or changed; reasons."
		/>
	</Field>

	<Field label="Allergies reviewed?">
		<RadioGroup label="Allergies reviewed?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="allergiesReviewed" value={opt.value} bind:group={d.allergiesReviewed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.allergiesReviewed === 'yes'}
		<Field label="Documented allergies and reactions" inputId="allergyNotes">
			<TextAreaInput
				id="allergyNotes"
				label="Documented allergies and reactions"
				rows={3}
				bind:value={d.allergyNotes}
				placeholder="e.g. Penicillin — rash. NKDA."
			/>
		</Field>
	{/if}
</Fieldset>

<style>
	.list-heading {
		margin: 0.5rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
