<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.itSystemsAccess;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="IT Systems & Access" description="Smartcard, accounts, clinical systems and telephony.">
	<div class="field-grid">
		<RadioGroup name="nhsSmartcardIssued" label="NHS smartcard issued?" options={yesNo} bind:value={d.nhsSmartcardIssued} />
		<TextInput name="nhsSmartcardNumber" label="Smartcard number" bind:value={d.nhsSmartcardNumber} />
	</div>
	<RadioGroup name="emailAccountCreated" label="Email account created?" options={yesNo} bind:value={d.emailAccountCreated} />
	<RadioGroup name="networkLoginCreated" label="Network login created?" options={yesNo} bind:value={d.networkLoginCreated} />
	<div class="field-grid">
		<RadioGroup name="clinicalSystemAccess" label="Clinical system access?" options={yesNo} bind:value={d.clinicalSystemAccess} />
		<TextInput name="clinicalSystemName" label="Clinical system name" bind:value={d.clinicalSystemName} />
	</div>
	<RadioGroup name="clinicalSystemTrainingCompleted" label="Clinical system training completed?" options={yesNo} bind:value={d.clinicalSystemTrainingCompleted} />
	<RadioGroup name="rosteringSystemAccess" label="Rostering system access?" options={yesNo} bind:value={d.rosteringSystemAccess} />
	<div class="field-grid">
		<TextInput name="phoneExtension" label="Phone extension" bind:value={d.phoneExtension} />
		<TextInput name="bleepNumber" label="Bleep number" bind:value={d.bleepNumber} />
	</div>

	<TextAreaInput name="itAccessNotes" label="Notes" rows={3} bind:value={d.itAccessNotes} />
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
