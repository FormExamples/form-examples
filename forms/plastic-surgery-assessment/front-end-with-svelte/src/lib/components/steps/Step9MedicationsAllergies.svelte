<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';

	const d = assessment.data.medicationsAllergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications &amp; Allergies">
	<p class="hint">Medications affecting surgery and any allergies.</p>

	<Field label="On anticoagulants?">
		<RadioGroup label="On anticoagulants?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onAnticoagulants" value={opt.value} bind:group={d.onAnticoagulants} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onAnticoagulants === 'yes'}
		<Field label="Anticoagulant details" inputId="anticoagulantDetails">
			<TextInput id="anticoagulantDetails" label="Anticoagulant details" bind:value={d.anticoagulantDetails} />
		</Field>
	{/if}

	<Field label="On antiplatelets?">
		<RadioGroup label="On antiplatelets?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onAntiplatelets" value={opt.value} bind:group={d.onAntiplatelets} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onAntiplatelets === 'yes'}
		<Field label="Antiplatelet details" inputId="antiplateletDetails">
			<TextInput id="antiplateletDetails" label="Antiplatelet details" bind:value={d.antiplateletDetails} />
		</Field>
	{/if}

	<Field label="On steroids?">
		<RadioGroup label="On steroids?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onSteroids" value={opt.value} bind:group={d.onSteroids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onSteroids === 'yes'}
		<Field label="Steroid details" inputId="steroidDetails">
			<TextInput id="steroidDetails" label="Steroid details" bind:value={d.steroidDetails} />
		</Field>
	{/if}

	<Field label="On immunosuppressants?">
		<RadioGroup label="On immunosuppressants?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onImmunosuppressants" value={opt.value} bind:group={d.onImmunosuppressants} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onImmunosuppressants === 'yes'}
		<Field label="Immunosuppressant details" inputId="immunosuppressantDetails">
			<TextInput id="immunosuppressantDetails" label="Immunosuppressant details" bind:value={d.immunosuppressantDetails} />
		</Field>
	{/if}

	<Field label="On chemotherapy?">
		<RadioGroup label="On chemotherapy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onChemotherapy" value={opt.value} bind:group={d.onChemotherapy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onChemotherapy === 'yes'}
		<Field label="Chemotherapy details" inputId="chemotherapyDetails">
			<TextInput id="chemotherapyDetails" label="Chemotherapy details" bind:value={d.chemotherapyDetails} />
		</Field>
	{/if}

	<Field label="On hormone therapy?">
		<RadioGroup label="On hormone therapy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onHormoneTherapy" value={opt.value} bind:group={d.onHormoneTherapy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.onHormoneTherapy === 'yes'}
		<Field label="Hormone therapy details" inputId="hormoneTherapyDetails">
			<TextInput id="hormoneTherapyDetails" label="Hormone therapy details" bind:value={d.hormoneTherapyDetails} />
		</Field>
	{/if}

	<Field label="Other medications" inputId="otherMedications">
		<TextAreaInput id="otherMedications" label="Other medications" rows={2} bind:value={d.otherMedications} />
	</Field>

	<Field label="Any drug allergies?">
		<RadioGroup label="Any drug allergies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasDrugAllergies" value={opt.value} bind:group={d.hasDrugAllergies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.hasDrugAllergies === 'yes'}
		<Field label="Drug allergy details">
			<AllergyEntry bind:allergies={d.allergies} />
		</Field>
	{/if}

	<Field label="Latex allergy?">
		<RadioGroup label="Latex allergy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="latexAllergy" value={opt.value} bind:group={d.latexAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Adhesive allergy?">
		<RadioGroup label="Adhesive allergy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adhesiveAllergy" value={opt.value} bind:group={d.adhesiveAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other allergies" inputId="otherAllergies">
		<TextInput id="otherAllergies" label="Other allergies" bind:value={d.otherAllergies} />
	</Field>
</Fieldset>
