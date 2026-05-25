<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">List all asthma-related medications you currently take.</p>

	<Field label="Controller Medications (preventers)" description="e.g., inhaled corticosteroids (ICS), ICS/LABA combinations, leukotriene receptor antagonists">
		<MedicationEntry bind:medications={m.controllerMedications} />
	</Field>

	<Field label="Rescue Inhalers (relievers)" description="e.g., salbutamol, terbutaline">
		<MedicationEntry bind:medications={m.rescueInhalers} />
	</Field>

	<Field label="Biologic Therapies" description="e.g., omalizumab, mepolizumab, dupilumab, benralizumab, tezepelumab">
		<MedicationEntry bind:medications={m.biologics} />
	</Field>

	<Field label="Are you currently taking oral corticosteroids?">
		<RadioGroup label="Oral steroids">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oralSteroids" value={opt.value} bind:group={m.oralSteroids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.oralSteroids === 'yes'}
		<Field label="Details (name, dose, duration)" inputId="oralSteroidDetails">
			<TextInput id="oralSteroidDetails" label="Oral steroid details" bind:value={m.oralSteroidDetails} />
		</Field>
	{/if}

	<Field label="Has your inhaler technique been reviewed recently?">
		<RadioGroup label="Inhaler technique reviewed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="inhalerTechniqueReviewed" value={opt.value} bind:group={m.inhalerTechniqueReviewed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How would you rate your medication adherence?" inputId="medicationAdherence">
		<Select id="medicationAdherence" label="Medication adherence" bind:value={m.medicationAdherence}>
			<option value="">— Select —</option>
			<option value="good">Good — I take my medications as prescribed</option>
			<option value="partial">Partial — I sometimes miss doses</option>
			<option value="poor">Poor — I often miss doses or do not take regularly</option>
		</Select>
	</Field>
</Fieldset>
