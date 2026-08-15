<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Conditions and medications affecting hearing.</p>

	<Field label="Are you taking any ototoxic medications?">
		<RadioGroup label="Ototoxic medications">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ototoxicMeds" value={opt.value} bind:group={m.ototoxicMedications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.ototoxicMedications === 'yes'}
		<Field label="Please list the medications" inputId="ototoxicDetails">
			<TextInput id="ototoxicDetails" label="Ototoxic medication details" bind:value={m.ototoxicMedicationDetails} />
		</Field>
	{/if}

	<Field label="Do you have an autoimmune condition?">
		<RadioGroup label="Autoimmune">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoimmune" value={opt.value} bind:group={m.autoimmune} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.autoimmune === 'yes'}
		<Field label="Please specify" inputId="autoimmuneDetails">
			<TextInput id="autoimmuneDetails" label="Autoimmune details" bind:value={m.autoimmuneDetails} />
		</Field>
	{/if}

	<Field label="Have you been diagnosed with Meniere's disease?">
		<RadioGroup label="Meniere's">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="menieres" value={opt.value} bind:group={m.menieres} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you been diagnosed with otosclerosis?">
		<RadioGroup label="Otosclerosis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="otosclerosis" value={opt.value} bind:group={m.otosclerosis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you been diagnosed with an acoustic neuroma?">
		<RadioGroup label="Acoustic neuroma">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="acousticNeuroma" value={opt.value} bind:group={m.acousticNeuroma} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had ear infections?">
		<RadioGroup label="Ear infections">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="infections" value={opt.value} bind:group={m.infections} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.infections === 'yes'}
		<Field label="Please describe (frequency, type, treatment)" inputId="infectionDetails">
			<TextAreaInput id="infectionDetails" label="Infection details" rows={3} bind:value={m.infectionDetails} />
		</Field>
	{/if}
</Fieldset>
