<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const s = assessment.data.medicationsSupplements;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	function addMedication() {
		s.currentMedications.push({ name: '', dose: '', frequency: '' });
	}
	function removeMedication(index: number) {
		s.currentMedications.splice(index, 1);
	}
</script>

<Fieldset legend="Current Medications & Supplements">
	<p class="hint">List medications and pre-conception supplements.</p>

	<h3 class="subsection-title">Current medications</h3>
	<p class="hint">Include prescribed and over-the-counter medications.</p>

	{#if s.currentMedications.length === 0}
		<p class="list-empty">None added.</p>
	{/if}
	{#each s.currentMedications as med, i (i)}
		<div class="med-row">
			<label class="med-cell">
				<span>Name</span>
				<input class="text-input" type="text" placeholder="e.g. Metformin" bind:value={med.name} />
			</label>
			<label class="med-cell">
				<span>Dose</span>
				<input class="text-input" type="text" placeholder="e.g. 500 mg" bind:value={med.dose} />
			</label>
			<label class="med-cell">
				<span>Frequency</span>
				<input class="text-input" type="text" placeholder="e.g. BD, OD" bind:value={med.frequency} />
			</label>
			<Button data-variant="danger" label="Remove medication" onclick={() => removeMedication(i)}>×</Button>
		</div>
	{/each}
	<Button data-variant="secondary" onclick={addMedication}>+ Add medication</Button>

	<Field label="Taking pre-conception folic acid?" class="mt-4">
		<RadioGroup label="Taking pre-conception folic acid?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="folicAcid" value={opt.value} bind:group={s.folicAcid} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.folicAcid === 'yes'}
		<Field label="Folic acid daily dose (mcg)" inputId="medicationsSupplements-folicAcidDoseMcg">
			<NumberInput id="medicationsSupplements-folicAcidDoseMcg" label="Folic acid daily dose" min={0} max={5000} bind:value={s.folicAcidDoseMcg} />
		</Field>
	{/if}

	<Field label="Taking vitamin D supplement?">
		<RadioGroup label="Taking vitamin D supplement?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vitaminD" value={opt.value} bind:group={s.vitaminD} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other supplements" inputId="medicationsSupplements-otherSupplements">
		<TextAreaInput id="medicationsSupplements-otherSupplements" label="Other supplements" rows={3} placeholder="List any other supplements (e.g. CoQ10, omega-3, prenatal multivitamin)…" bind:value={s.otherSupplements} />
	</Field>
</Fieldset>

<style>
	.subsection-title {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.list-empty {
		color: var(--color-muted);
		font-style: italic;
	}
	.med-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr auto;
		gap: 0.75rem;
		align-items: end;
		margin-bottom: 0.75rem;
	}
	.med-cell {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
	}
	@media (max-width: 640px) {
		.med-row {
			grid-template-columns: 1fr;
		}
	}
</style>
