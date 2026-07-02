<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.consent;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 7 of 9 — Consent and information sharing">
	<p class="hint">
		The consent position, and — where consent was not given — the lawful basis for sharing
		(Working Together 2023).
	</p>

	<Field label="Was consent to refer sought?">
		<RadioGroup label="Was consent to refer sought?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="consent-consentSought"
						value={opt.value}
						bind:group={c.consentSought}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Consent status"
		description="A valid referral needs consent given, or a lawful basis to share without it."
		inputId="consent-consentStatus"
	>
		<Select id="consent-consentStatus" label="Consent status" bind:value={c.consentStatus}>
			<option value="">— Select —</option>
			<option value="given">Consent given</option>
			<option value="refused">Consent refused</option>
			<option value="not-sought">Consent not sought</option>
		</Select>
	</Field>

	{#if c.consentStatus !== '' && c.consentStatus !== 'given'}
		<p class="hint">
			Because consent was not given, record the lawful basis for sharing information without
			consent.
		</p>
		<Field
			label="Lawful basis for sharing without consent"
			inputId="consent-sharingBasisWithoutConsent"
		>
			<Select
				id="consent-sharingBasisWithoutConsent"
				label="Lawful basis for sharing without consent"
				bind:value={c.sharingBasisWithoutConsent}
			>
				<option value="">— Select —</option>
				<option value="risk-of-serious-harm">Risk of serious harm</option>
				<option value="seeking-consent-increases-risk">
					Seeking consent would increase risk
				</option>
				<option value="not-applicable">Not applicable (consent given)</option>
			</Select>
		</Field>
	{/if}

	<Field label="Are the child and family aware of this referral?">
		<RadioGroup label="Are the child and family aware of this referral?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="consent-familyAware"
						value={opt.value}
						bind:group={c.familyAware}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.familyAware === 'no'}
		<p class="hint">
			Because the child / family are not aware, record why informing them would increase risk.
		</p>
		<Field label="Why informing would increase risk" inputId="consent-unsafeToInformReason">
			<TextAreaInput
				id="consent-unsafeToInformReason"
				label="Why informing would increase risk"
				rows={3}
				placeholder="The reason it is unsafe to inform the child or family at this stage."
				bind:value={c.unsafeToInformReason}
			/>
		</Field>
	{/if}
</Fieldset>
