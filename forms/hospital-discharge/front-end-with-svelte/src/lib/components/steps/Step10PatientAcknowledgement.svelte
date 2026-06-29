<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientAcknowledgement;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Patient / Carer Acknowledgement">
	<p class="hint">Confirmation that the patient understands the plan.</p>

	<Field label="Does the patient understand the discharge plan?">
		<RadioGroup label="Does the patient understand the discharge plan?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="patientUnderstandsPlan" value={opt.value} bind:group={d.patientUnderstandsPlan} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Carer informed of discharge?">
		<RadioGroup label="Carer informed of discharge?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="carerInformed" value={opt.value} bind:group={d.carerInformed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.carerInformed === 'yes'}
		<Field label="Carer name" inputId="carerName">
			<TextInput id="carerName" label="Carer name" bind:value={d.carerName} />
		</Field>
	{/if}

	<Field label="Medications explained to patient/carer?">
		<RadioGroup label="Medications explained to patient/carer?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="medicationsExplained" value={opt.value} bind:group={d.medicationsExplained} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Written discharge summary provided?">
		<RadioGroup label="Written discharge summary provided?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="writtenSummaryProvided" value={opt.value} bind:group={d.writtenSummaryProvided} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="All patient questions answered?">
		<RadioGroup label="All patient questions answered?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="questionsAnswered" value={opt.value} bind:group={d.questionsAnswered} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Acknowledgement date" inputId="acknowledgementDate">
			<DateInput id="acknowledgementDate" label="Acknowledgement date" bind:value={d.acknowledgementDate} />
		</Field>
		<Field label="Signed by (patient or carer name)" inputId="signedBy">
			<TextInput id="signedBy" label="Signed by" bind:value={d.signedBy} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
