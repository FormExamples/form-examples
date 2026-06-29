<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.ethicalLegalRequirements;
	const reg = assessment.data.donorTypeRegistration;
	const isDeceased = $derived(reg.donorType === 'deceased');
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="9. Ethical & Legal Requirements">
	<p class="hint">HTA Act 2004 compliance, independent assessor review, informed consent (UK living-donor framework).</p>

	{#if isDeceased}
		<p class="not-applicable">Not applicable for deceased donors (deceased-donor authorisation follows a separate pathway).</p>
	{:else}
		<Field label="HTA Act 2004 compliance confirmed?">
			<RadioGroup label="HTA Act 2004 compliance confirmed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="htaAct2004Compliant" value={opt.value} bind:group={d.htaAct2004Compliant} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Independent assessor review completed?">
			<RadioGroup label="Independent assessor review completed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="independentAssessorReview" value={opt.value} bind:group={d.independentAssessorReview} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d.independentAssessorReview === 'yes'}
			<div class="field-grid">
				<Field label="Independent assessor name" inputId="independentAssessorName">
					<TextInput id="independentAssessorName" label="Independent assessor name" bind:value={d.independentAssessorName} />
				</Field>
				<Field label="Independent assessor date" inputId="independentAssessorDate">
					<DateInput id="independentAssessorDate" label="Independent assessor date" bind:value={d.independentAssessorDate} />
				</Field>
			</div>
		{/if}

		<Field label="Informed consent given?">
			<RadioGroup label="Informed consent given?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="informedConsentGiven" value={opt.value} bind:group={d.informedConsentGiven} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Consent form signed?">
			<RadioGroup label="Consent form signed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="consentFormSigned" value={opt.value} bind:group={d.consentFormSigned} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Consent date" inputId="consentDate">
			<DateInput id="consentDate" label="Consent date" bind:value={d.consentDate} />
		</Field>

		<div class="field-grid">
			<Field label="Witness name" inputId="witnessName">
				<TextInput id="witnessName" label="Witness name" bind:value={d.witnessName} />
			</Field>
			<Field label="Witness role" inputId="witnessRole">
				<TextInput id="witnessRole" label="Witness role" bind:value={d.witnessRole} />
			</Field>
		</div>

		<Field label="Information leaflet provided?">
			<RadioGroup label="Information leaflet provided?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="informationLeafletProvided" value={opt.value} bind:group={d.informationLeafletProvided} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="All donor questions answered?">
			<RadioGroup label="All donor questions answered?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="questionsAnswered" value={opt.value} bind:group={d.questionsAnswered} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Confirmed: no financial reward / inducement (HTA Act 2004 prohibition)?">
			<RadioGroup label="Confirmed: no financial reward / inducement?">
				<label><input type="radio" class="radio-input" name="financialRewardCheck" value="yes" bind:group={d.financialRewardCheck} /> Yes — confirmed no inducement</label>
				<label><input type="radio" class="radio-input" name="financialRewardCheck" value="no" bind:group={d.financialRewardCheck} /> No — concerns identified</label>
			</RadioGroup>
		</Field>

		<Field label="Ethics committee approval received?">
			<RadioGroup label="Ethics committee approval received?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="ethicsCommitteeApproval" value={opt.value} bind:group={d.ethicsCommitteeApproval} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d.ethicsCommitteeApproval === 'yes'}
			<Field label="Ethics approval reference" inputId="ethicsApprovalReference">
				<TextInput id="ethicsApprovalReference" label="Ethics approval reference" bind:value={d.ethicsApprovalReference} />
			</Field>
		{/if}
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
	.not-applicable {
		margin: 0;
		color: var(--color-muted);
		font-style: italic;
	}
</style>
