<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const s = assessment.data.signatureConsent;

	const consentOptions = [
		{ value: 'yes', label: 'I consent to the proposed treatment' },
		{ value: 'no', label: 'I do not consent' }
	];

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Signature & Consent">
	<p class="hint">Final consent confirmation and signature details.</p>

	<Alert type="warning">
		<p>By confirming consent below, the patient agrees to the proposed procedure as described in this form.</p>
	</Alert>

	<Field label="Patient Consent" required>
		<RadioGroup label="Patient Consent">
			{#each consentOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="patientConsent"
						value={opt.value}
						bind:group={s.patientConsent}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Signature Date" required inputId="signatureDate">
		<DateInput id="signatureDate" label="Signature Date" required bind:value={s.signatureDate} />
	</Field>

	<h3 class="step-subhead">Witness Details</h3>
	<div class="field-grid">
		<Field label="Witness Name" required inputId="witnessName">
			<TextInput id="witnessName" label="Witness Name" required bind:value={s.witnessName} />
		</Field>
		<Field label="Witness Role" required inputId="witnessRole">
			<TextInput
				id="witnessRole"
				label="Witness Role"
				placeholder="e.g., Staff Nurse"
				required
				bind:value={s.witnessRole}
			/>
		</Field>
	</div>
	<Field label="Witness Signature Date" inputId="witnessSignatureDate">
		<DateInput
			id="witnessSignatureDate"
			label="Witness Signature Date"
			bind:value={s.witnessSignatureDate}
		/>
	</Field>

	<h3 class="step-subhead">Clinician Details</h3>
	<div class="field-grid">
		<Field label="Clinician Name" required inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician Name" required bind:value={s.clinicianName} />
		</Field>
		<Field label="Clinician Role" required inputId="clinicianRole">
			<TextInput
				id="clinicianRole"
				label="Clinician Role"
				placeholder="e.g., Consultant Surgeon"
				required
				bind:value={s.clinicianRole}
			/>
		</Field>
	</div>
	<Field label="Clinician Signature Date" inputId="clinicianSignatureDate">
		<DateInput
			id="clinicianSignatureDate"
			label="Clinician Signature Date"
			bind:value={s.clinicianSignatureDate}
		/>
	</Field>

	<h3 class="step-subhead">Interpreter (if applicable)</h3>
	<Field label="Was an interpreter used?">
		<RadioGroup label="Was an interpreter used?">
			{#each yesNoOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="interpreterUsed"
						value={opt.value}
						bind:group={s.interpreterUsed}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.interpreterUsed === 'yes'}
		<Field label="Interpreter Name" required inputId="interpreterName">
			<TextInput
				id="interpreterName"
				label="Interpreter Name"
				required
				bind:value={s.interpreterName}
			/>
		</Field>
	{/if}
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
	.step-subhead {
		font-size: 1rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem;
	}
</style>
