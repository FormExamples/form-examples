<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const med = assessment.data.currentMedications;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Current pharmacological treatments - important for interaction assessment.</p>

	<Field label="Currently on insulin therapy?">
		<RadioGroup label="Insulin therapy">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="insulinTherapy" value={opt.value} bind:group={med.insulinTherapy} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if med.insulinTherapy === 'yes'}
		<Field label="Insulin Type and Regimen" inputId="insulinType">
			<TextInput id="insulinType" label="Insulin type" placeholder="e.g., Basal insulin glargine 20 units, Rapid-acting insulin aspart..." bind:value={med.insulinType} />
		</Field>
	{/if}

	<Field label="Currently on sulfonylureas?">
		<RadioGroup label="Sulfonylureas">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sulfonylureas" value={opt.value} bind:group={med.sulfonylureas} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="section-h">Other Diabetes Medications</h3>
	<MedicationEntry bind:medications={med.otherDiabetesMedications} />
	{#if med.otherDiabetesMedications.length === 0}<p class="hint">No other diabetes medications added.</p>{/if}

	<h3 class="section-h">Antihypertensives</h3>
	<MedicationEntry bind:medications={med.antihypertensives} />
	{#if med.antihypertensives.length === 0}<p class="hint">No antihypertensives added.</p>{/if}

	<h3 class="section-h">Lipid-Lowering Medications</h3>
	<MedicationEntry bind:medications={med.lipidLowering} />
	{#if med.lipidLowering.length === 0}<p class="hint">No lipid-lowering medications added.</p>{/if}

	<h3 class="section-h">Other Medications</h3>
	<MedicationEntry bind:medications={med.otherMedications} />
	{#if med.otherMedications.length === 0}<p class="hint">No other medications added.</p>{/if}
</Fieldset>

<style>.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }</style>
