<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const meds: { key: 'saba' | 'laba' | 'lama' | 'ics' | 'oralCorticosteroids' | 'nebulizers'; name: string; label: string }[] = [
		{ key: 'saba', name: 'saba', label: 'SABA (Short-acting bronchodilator, e.g. salbutamol)?' },
		{ key: 'laba', name: 'laba', label: 'LABA (Long-acting beta-agonist, e.g. salmeterol, formoterol)?' },
		{ key: 'lama', name: 'lama', label: 'LAMA (Long-acting muscarinic antagonist, e.g. tiotropium)?' },
		{ key: 'ics', name: 'ics', label: 'ICS (Inhaled corticosteroid, e.g. fluticasone, budesonide)?' },
		{ key: 'oralCorticosteroids', name: 'oralCS', label: 'Oral corticosteroids (e.g. prednisolone)?' },
		{ key: 'nebulizers', name: 'nebulizers', label: 'Nebulisers?' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Inhalers, oral medications, and respiratory therapies.</p>

	{#each meds as med (med.key)}
		<Field label={med.label}>
			<RadioGroup label={med.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={med.name} value={opt.value} bind:group={m[med.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Long-term oxygen therapy?">
		<RadioGroup label="Oxygen therapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oxygenTherapy" value={opt.value} bind:group={m.oxygenTherapy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.oxygenTherapy === 'yes'}
		<Field label="Oxygen flow rate (L/min)" inputId="o2LPM">
			<NumberInput id="o2LPM" label="Oxygen flow rate" min={0} max={15} step={0.5} bind:value={m.oxygenLitresPerMinute} />
		</Field>
	{/if}

	<Field label="Other Medications">
		<MedicationEntry bind:medications={m.otherMedications} />
	</Field>
</Fieldset>
