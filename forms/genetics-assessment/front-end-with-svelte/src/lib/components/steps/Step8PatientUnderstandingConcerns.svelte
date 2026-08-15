<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.patientUnderstandingConcerns;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Patient Understanding & Concerns">
	<p class="hint">Patient's perspective, expectations and consent.</p>

	<Field label="What is the patient's understanding of why they have been referred?" inputId="understandingOfReferral">
		<TextAreaInput id="understandingOfReferral" label="Understanding of referral" rows={3} bind:value={d.understandingOfReferral} />
	</Field>
	<Field label="Patient's primary concerns" inputId="primaryConcerns">
		<TextAreaInput id="primaryConcerns" label="Primary concerns" rows={2} bind:value={d.primaryConcerns} />
	</Field>
	<Field label="Patient's expectations of this appointment" inputId="expectations">
		<TextAreaInput id="expectations" label="Expectations" rows={2} bind:value={d.expectations} />
	</Field>

	<Field label="Insurance / employment implications a concern?">
		<RadioGroup label="Insurance concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="insuranceConcerns" value={opt.value} bind:group={d.insuranceConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Confidentiality concerns?">
		<RadioGroup label="Confidentiality concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="confidentialityConcerns" value={opt.value} bind:group={d.confidentialityConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Reproductive implications a concern?">
		<RadioGroup label="Reproductive implications?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reproductiveImplications" value={opt.value} bind:group={d.reproductiveImplications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Support system (who can the patient talk to?)" inputId="supportSystem">
		<TextAreaInput id="supportSystem" label="Support system" rows={2} bind:value={d.supportSystem} />
	</Field>

	<Field label="Does the patient consent to genetic testing today?">
		<RadioGroup label="Consent to testing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToTesting" value={opt.value} bind:group={d.consentToTesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
