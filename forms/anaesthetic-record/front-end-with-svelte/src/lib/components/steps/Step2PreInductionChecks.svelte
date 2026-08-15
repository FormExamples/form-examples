<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = $state(assessment.data.preInduction);
</script>

<Fieldset legend="Step 2 of 12 — Pre-induction checks">
	<p class="hint">
		Machine check, WHO Safer Surgery Checklist, consent, fasting, access, allergies.
	</p>

	<Field label="Anaesthetic machine checked?" inputId="preInduction-machineChecked">
		<Select id="preInduction-machineChecked" label="Anaesthetic machine checked?" bind:value={p.machineChecked}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="WHO Sign In performed?" required inputId="preInduction-whoSignIn">
		<Select id="preInduction-whoSignIn" label="WHO Sign In performed?" required bind:value={p.whoSignIn}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="WHO Time Out performed?" required inputId="preInduction-whoTimeOut">
		<Select id="preInduction-whoTimeOut" label="WHO Time Out performed?" required bind:value={p.whoTimeOut}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Consent confirmed?"
		description="Not confirmed raises a safety flag."
		inputId="preInduction-consentConfirmed"
	>
		<Select id="preInduction-consentConfirmed" label="Consent confirmed?" bind:value={p.consentConfirmed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Fasting confirmed?" inputId="preInduction-fastingConfirmed">
		<Select id="preInduction-fastingConfirmed" label="Fasting confirmed?" bind:value={p.fastingConfirmed}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="IV access sites" inputId="preInduction-ivAccess">
		<TextInput
			id="preInduction-ivAccess"
			label="IV access sites"
			placeholder="e.g. 18G right hand, 16G left forearm"
			bind:value={p.ivAccess}
		/>
	</Field>

	<Field label="Allergy band checked?" inputId="preInduction-allergyBandChecked">
		<Select id="preInduction-allergyBandChecked" label="Allergy band checked?" bind:value={p.allergyBandChecked}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Documented allergies"
		description="Used for the allergy-conflict safety check against administered drugs."
		inputId="preInduction-documentedAllergies"
	>
		<TextAreaInput
			id="preInduction-documentedAllergies"
			label="Documented allergies"
			rows={3}
			placeholder="e.g. Penicillin, morphine"
			bind:value={p.documentedAllergies}
		/>
	</Field>
</Fieldset>
