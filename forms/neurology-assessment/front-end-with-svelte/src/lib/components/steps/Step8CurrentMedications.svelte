<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const med = assessment.data.currentMedications;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Neurological and relevant medications.</p>

	<Field label="Medication List">
		<MedicationEntry bind:medications={med.medications} />
	</Field>

	<Field label="Taking anticonvulsants?">
		<RadioGroup label="Anticonvulsants">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anticonvulsants" value={opt.value} bind:group={med.anticonvulsants} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if med.anticonvulsants === 'yes'}
		<Field label="Anticonvulsant details" inputId="anticonvulsantDetails">
			<TextAreaInput id="anticonvulsantDetails" label="Anticonvulsant details" rows={2} placeholder="e.g., levetiracetam 500mg BD..." bind:value={med.anticonvulsantDetails} />
		</Field>
	{/if}

	<Field label="Taking migraine prophylaxis?">
		<RadioGroup label="Migraine prophylaxis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="migraineProphylaxis" value={opt.value} bind:group={med.migraineProphylaxis} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if med.migraineProphylaxis === 'yes'}
		<Field label="Migraine prophylaxis details" inputId="migraineDetails">
			<TextAreaInput id="migraineDetails" label="Migraine details" rows={2} placeholder="e.g., propranolol, topiramate..." bind:value={med.migraineProphylaxisDetails} />
		</Field>
	{/if}

	<Field label="Taking neuropathic pain medication?">
		<RadioGroup label="Neuropathic pain meds">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neuropathicPain" value={opt.value} bind:group={med.neuropathicPainMeds} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if med.neuropathicPainMeds === 'yes'}
		<Field label="Neuropathic pain medication details" inputId="neuropathicDetails">
			<TextAreaInput id="neuropathicDetails" label="Neuropathic details" rows={2} placeholder="e.g., gabapentin, pregabalin..." bind:value={med.neuropathicPainDetails} />
		</Field>
	{/if}

	<Field label="Taking anticoagulants?">
		<RadioGroup label="Anticoagulants">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anticoagulants" value={opt.value} bind:group={med.anticoagulants} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if med.anticoagulants === 'yes'}
		<Field label="Anticoagulant details" inputId="anticoagulantDetails">
			<TextAreaInput id="anticoagulantDetails" label="Anticoagulant details" rows={2} placeholder="e.g., warfarin, apixaban..." bind:value={med.anticoagulantDetails} />
		</Field>
	{/if}
</Fieldset>
