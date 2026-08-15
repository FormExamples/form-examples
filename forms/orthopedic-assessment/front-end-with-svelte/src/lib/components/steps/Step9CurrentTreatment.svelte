<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';

	const tx = assessment.data.currentTreatment;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Treatment">
	<p class="hint">Current medications, therapies, and allergy information.</p>

	<Field label="Current Medications">
		<MedicationEntry bind:medications={tx.medications} />
	</Field>

	<Field label="Are you currently having physical therapy?">
		<RadioGroup label="Physical therapy">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="physicalTherapy" value={opt.value} bind:group={tx.physicalTherapy} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if tx.physicalTherapy === 'yes'}
		<Field label="Physical Therapy Details" inputId="physicalTherapyDetails">
			<TextAreaInput id="physicalTherapyDetails" label="Physical Therapy Details" rows={3} bind:value={tx.physicalTherapyDetails} />
		</Field>
	{/if}

	<Field label="Have you had any joint injections?">
		<RadioGroup label="Joint injections">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="injections" value={opt.value} bind:group={tx.injections} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if tx.injections === 'yes'}
		<Field label="Injection Details" inputId="injectionDetails">
			<TextAreaInput id="injectionDetails" label="Injection Details" rows={3} bind:value={tx.injectionDetails} />
		</Field>
	{/if}

	<Field label="Are you using a brace or splint?">
		<RadioGroup label="Brace or splint">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="braceOrSplint" value={opt.value} bind:group={tx.braceOrSplint} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if tx.braceOrSplint === 'yes'}
		<Field label="Brace/Splint Details" inputId="braceDetails">
			<TextAreaInput id="braceDetails" label="Brace details" rows={3} bind:value={tx.braceDetails} />
		</Field>
	{/if}

	<Field label="Other Treatments" inputId="otherTreatments" description="e.g., acupuncture, TENS, ice/heat therapy">
		<TextAreaInput id="otherTreatments" label="Other Treatments" rows={3} bind:value={tx.otherTreatments} />
	</Field>

	<Field label="Drug Allergies">
		<AllergyEntry bind:allergies={tx.allergies} />
	</Field>
</Fieldset>
