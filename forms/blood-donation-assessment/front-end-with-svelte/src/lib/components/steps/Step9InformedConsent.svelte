<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.informedConsent;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Informed Consent">
	<p class="hint">Confirm you understand and agree to the donation process.</p>

	<Field label="Have you read and understood the donor information leaflet?">
		<RadioGroup label="Have you read and understood the donor information leaflet?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="understoodInformation" value={opt.value} bind:group={c.understoodInformation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you consent to donate blood today?">
		<RadioGroup label="Do you consent to donate blood today?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToDonate" value={opt.value} bind:group={c.consentToDonate} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you consent to mandatory testing (HIV, hepatitis B, hepatitis C, syphilis, HTLV)?">
		<RadioGroup label="Do you consent to mandatory testing (HIV, hepatitis B, hepatitis C, syphilis, HTLV)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToTesting" value={opt.value} bind:group={c.consentToTesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you consent to be contacted with test results if any are abnormal?">
		<RadioGroup label="Do you consent to be contacted with test results if any are abnormal?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToContact" value={opt.value} bind:group={c.consentToContact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
