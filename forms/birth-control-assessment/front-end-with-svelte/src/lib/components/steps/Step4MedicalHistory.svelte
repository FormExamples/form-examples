<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const h = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const migraineFreq = [
		{ value: 'rare', label: 'Rare' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'weekly', label: 'Weekly' }
	];
</script>

<Fieldset legend="Medical History" description="Conditions affecting contraceptive eligibility.">
	<RadioGroup label="Do you suffer from migraines?" name="migraine" options={yesNo} bind:value={h.migraine} />
	{#if h.migraine === 'yes'}
		<RadioGroup label="Are they migraines with aura (visual or sensory warning)?" name="migraineWithAura" options={yesNo} bind:value={h.migraineWithAura} />
		<RadioGroup label="Migraine frequency" name="migraineFrequency" options={migraineFreq} bind:value={h.migraineFrequency} />
	{/if}

	<Field label="Breast cancer history" inputId="breastCancer">
		<Select id="breastCancer" label="Breast cancer history" bind:value={h.breastCancer}>
			<option value="no">No history</option>
			<option value="current">Current breast cancer</option>
			<option value="past-5-years">Within past 5 years</option>
			<option value="past-over-5-years">More than 5 years ago</option>
		</Select>
	</Field>

	<RadioGroup label="History of cervical cancer or abnormal smear?" name="cervicalCancer" options={yesNo} bind:value={h.cervicalCancer} />

	<Field label="Liver disease" inputId="liverDisease">
		<Select id="liverDisease" label="Liver disease" bind:value={h.liverDisease}>
			<option value="no">None</option>
			<option value="active-hepatitis">Active viral hepatitis</option>
			<option value="cirrhosis">Cirrhosis</option>
			<option value="liver-tumour">Liver tumour</option>
		</Select>
	</Field>

	<RadioGroup label="Gallbladder disease?" name="gallbladderDisease" options={yesNo} bind:value={h.gallbladderDisease} />
	<RadioGroup label="Inflammatory bowel disease?" name="inflammatoryBowelDisease" options={yesNo} bind:value={h.inflammatoryBowelDisease} />

	<RadioGroup label="Systemic lupus erythematosus (SLE)?" name="sle" options={yesNo} bind:value={h.sle} />
	{#if h.sle === 'yes'}
		<RadioGroup label="With antiphospholipid antibodies?" name="sleAntiphospholipid" options={yesNo} bind:value={h.sleAntiphospholipid} />
	{/if}

	<RadioGroup label="Epilepsy?" name="epilepsy" options={yesNo} bind:value={h.epilepsy} />

	<Field label="Diabetes" inputId="diabetes">
		<Select id="diabetes" label="Diabetes" bind:value={h.diabetes}>
			<option value="no">No</option>
			<option value="type-1">Type 1</option>
			<option value="type-2">Type 2</option>
			<option value="gestational">Gestational</option>
		</Select>
	</Field>
	{#if h.diabetes === 'type-1' || h.diabetes === 'type-2'}
		<RadioGroup label="Any vascular complications (retinopathy, nephropathy, neuropathy)?" name="diabetesComplications" options={yesNo} bind:value={h.diabetesComplications} />
	{/if}

	<RadioGroup label="Current or recent sexually transmitted infection (STI)?" name="sti" options={yesNo} bind:value={h.sti} />
	{#if h.sti === 'yes'}
		<TextInput label="STI details" name="stiDetails" bind:value={h.stiDetails} />
	{/if}

	<RadioGroup label="History of pelvic inflammatory disease (PID)?" name="pid" options={yesNo} bind:value={h.pid} />
</Fieldset>
