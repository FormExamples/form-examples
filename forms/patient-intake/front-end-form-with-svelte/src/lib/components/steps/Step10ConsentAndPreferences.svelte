<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const c = assessment.data.consentAndPreferences;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Consent & Preferences">
	<p class="hint">Please review and confirm your preferences</p>
	<Field label="Do you consent to treatment?" required><RadioGroup label="Do you consent to treatment?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="consentTreatment" value={opt.value} bind:group={c.consentToTreatment} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you acknowledge our privacy notice and agree to the use of your data for clinical purposes?" required><RadioGroup label="Do you acknowledge our privacy notice and agree to the use of your data for clinical purposes?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="privacyAck" value={opt.value} bind:group={c.privacyAcknowledgement} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Preferred communication method" inputId="commPref"><Select id="commPref" label="Preferred communication method" bind:value={c.communicationPreference}><option value="">-- Select --</option>{#each [
			{ value: 'phone', label: 'Phone' },
			{ value: 'email', label: 'Email' },
			{ value: 'text', label: 'Text/SMS' },
			{ value: 'post', label: 'Post' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Do you have any advance directives (living will, power of attorney for healthcare)?"><RadioGroup label="Do you have any advance directives (living will, power of attorney for healthcare)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="advanceDirectives" value={opt.value} bind:group={c.advanceDirectives}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.advanceDirectives === 'yes'}
		<Field label="Please provide details" inputId="directiveDetails"><TextAreaInput id="directiveDetails" label="Please provide details" bind:value={c.advanceDirectiveDetails} /></Field>
	{/if}
</Fieldset>
