<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.anaesthesiaSummary;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const anaesOptions = [
		{ value: 'general', label: 'General anaesthesia' },
		{ value: 'regional', label: 'Regional' },
		{ value: 'spinal', label: 'Spinal' },
		{ value: 'epidural', label: 'Epidural' },
		{ value: 'combined-spinal-epidural', label: 'Combined spinal-epidural' },
		{ value: 'monitored-anaesthesia-care', label: 'Monitored anaesthesia care' },
		{ value: 'local', label: 'Local anaesthesia' },
		{ value: 'sedation', label: 'Sedation' },
		{ value: 'none', label: 'None' }
	];
</script>

<Fieldset legend="Anaesthesia Summary">
	<p class="hint">Anaesthetic technique, airway, and notable events.</p>

	<Field label="Anaesthesia type" inputId="anaesthesiaType">
		<Select label="Anaesthesia type" bind:value={d.anaesthesiaType}>
			<option value="">— Select —</option>
			{#each anaesOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Airway management" inputId="airwayManagement">
		<TextInput id="airwayManagement" label="Airway management" placeholder="e.g. ETT 7.5, LMA, supraglottic device" bind:value={d.airwayManagement} />
	</Field>

	<Field label="Difficult intubation?">
		<RadioGroup label="Difficult intubation?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="difficultIntubation" value={opt.value} bind:group={d.difficultIntubation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.difficultIntubation === 'yes'}
		<Field label="Airway notes" inputId="airwayNotes">
			<TextAreaInput id="airwayNotes" label="Airway notes" rows={2} placeholder="Cormack-Lehane grade, adjuncts, attempts, etc." bind:value={d.airwayNotes} />
		</Field>
	{/if}

	<Field label="Medications administered" inputId="medicationsAdministered">
		<TextAreaInput id="medicationsAdministered" label="Medications administered" rows={3} placeholder="Induction, maintenance, paralytics, opioids, antibiotics, etc." bind:value={d.medicationsAdministered} />
	</Field>

	<Field label="Reversal agents" inputId="reversalAgents">
		<TextInput id="reversalAgents" label="Reversal agents" placeholder="e.g. Sugammadex 2 mg/kg" bind:value={d.reversalAgents} />
	</Field>

	<Field label="Anaesthesia notes" inputId="anaesthesiaNotes">
		<TextAreaInput id="anaesthesiaNotes" label="Anaesthesia notes" rows={3} placeholder="Notable events, hypotension, arrhythmia, etc." bind:value={d.anaesthesiaNotes} />
	</Field>
</Fieldset>
