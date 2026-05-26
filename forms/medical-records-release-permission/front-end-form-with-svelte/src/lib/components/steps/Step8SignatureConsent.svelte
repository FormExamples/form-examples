<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const s = assessment.data.signatureConsent;

	const confirmOptions = [
		{ value: 'yes', label: 'I confirm and consent' },
		{ value: 'no', label: 'I do not consent' }
	];

	const witnessOptions = [
		{ value: 'yes', label: 'Confirmed' },
		{ value: 'no', label: 'Not confirmed' }
	];
</script>

<Fieldset legend="Signature & Consent">
	<p class="hint">Confirm your consent to release the specified medical records.</p>

	<Alert type="info" heading="Declaration">
		<p>
			By confirming below, I authorize the release of the medical records specified in this form to
			the named recipient for the stated purpose. I understand that I may revoke this authorization
			at any time in writing, and that records released prior to revocation cannot be recalled.
		</p>
	</Alert>

	<Field label="I confirm my consent to release my medical records as specified in this form" required>
		<RadioGroup label="I confirm my consent to release my medical records as specified in this form">
			{#each confirmOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="patientSignatureConfirmed"
						value={opt.value}
						bind:group={s.patientSignatureConfirmed}
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

	<h3 class="step-subhead">Witness Details (if applicable)</h3>
	<p class="hint">
		A witness signature is recommended for vulnerable patients or when a parent/guardian is involved.
	</p>

	<Field label="Witness Name" inputId="witnessName">
		<TextInput
			id="witnessName"
			label="Witness Name"
			placeholder="Full name of witness"
			bind:value={s.witnessName}
		/>
	</Field>

	{#if s.witnessName}
		<Field label="Witness signature confirmed">
			<RadioGroup label="Witness signature confirmed">
				{#each witnessOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="witnessSignatureConfirmed"
							value={opt.value}
							bind:group={s.witnessSignatureConfirmed}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Witness Date" inputId="witnessDate">
			<DateInput id="witnessDate" label="Witness Date" bind:value={s.witnessDate} />
		</Field>
	{/if}

	<h3 class="step-subhead">Parent / Guardian (if applicable)</h3>
	<p class="hint">
		Complete this section only if the patient is under 18 or lacks capacity to consent.
	</p>

	<Field label="Parent / Guardian Name" inputId="parentGuardianName">
		<TextInput
			id="parentGuardianName"
			label="Parent / Guardian Name"
			placeholder="Full name of parent or guardian (if applicable)"
			bind:value={s.parentGuardianName}
		/>
	</Field>
</Fieldset>

<style>
	.step-subhead {
		font-size: 1rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem;
	}
</style>
