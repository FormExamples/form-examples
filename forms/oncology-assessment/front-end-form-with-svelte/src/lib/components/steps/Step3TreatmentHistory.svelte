<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatmentHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Treatment History">
	<p class="hint">Previous oncology treatments received.</p>

	<Field label="Previous surgery for this cancer?">
		<RadioGroup label="Previous surgery">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevSurgery" value={opt.value} bind:group={t.previousSurgery} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousSurgery === 'yes'}
		<Field label="Surgery details" inputId="surgeryDetails">
			<TextAreaInput id="surgeryDetails" label="Surgery details" rows={2} placeholder="Type of surgery, date, outcome" bind:value={t.surgeryDetails} />
		</Field>
	{/if}

	<Field label="Previous chemotherapy?">
		<RadioGroup label="Previous chemotherapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevChemo" value={opt.value} bind:group={t.previousChemotherapy} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousChemotherapy === 'yes'}
		<Field label="Chemotherapy regimens" inputId="chemoRegimens">
			<TextAreaInput id="chemoRegimens" label="Chemotherapy regimens" rows={2} placeholder="e.g., AC-T, FOLFOX..." bind:value={t.chemotherapyRegimens} />
		</Field>
	{/if}

	<Field label="Previous radiation therapy?">
		<RadioGroup label="Previous radiation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevRadiation" value={opt.value} bind:group={t.previousRadiation} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousRadiation === 'yes'}
		<Field label="Radiation details" inputId="radiationDetails">
			<TextAreaInput id="radiationDetails" label="Radiation details" rows={2} placeholder="Site, dose, fractions" bind:value={t.radiationDetails} />
		</Field>
	{/if}

	<Field label="Previous immunotherapy?">
		<RadioGroup label="Previous immunotherapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevImmuno" value={opt.value} bind:group={t.previousImmunotherapy} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousImmunotherapy === 'yes'}
		<Field label="Immunotherapy details" inputId="immunoDetails">
			<TextAreaInput id="immunoDetails" label="Immunotherapy details" rows={2} placeholder="e.g., Pembrolizumab, Nivolumab" bind:value={t.immunotherapyDetails} />
		</Field>
	{/if}

	<Field label="Previous targeted therapy?">
		<RadioGroup label="Previous targeted therapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevTargeted" value={opt.value} bind:group={t.previousTargetedTherapy} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousTargetedTherapy === 'yes'}
		<Field label="Targeted therapy details" inputId="targetedDetails">
			<TextAreaInput id="targetedDetails" label="Targeted therapy details" rows={2} placeholder="e.g., Trastuzumab, Imatinib" bind:value={t.targetedTherapyDetails} />
		</Field>
	{/if}

	<Field label="Clinical trial participation?">
		<RadioGroup label="Clinical trial">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clinicalTrial" value={opt.value} bind:group={t.clinicalTrialParticipation} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.clinicalTrialParticipation === 'yes'}
		<Field label="Clinical trial details" inputId="trialDetails">
			<TextAreaInput id="trialDetails" label="Clinical trial details" rows={2} placeholder="Trial name, phase, status" bind:value={t.clinicalTrialDetails} />
		</Field>
	{/if}
</Fieldset>
