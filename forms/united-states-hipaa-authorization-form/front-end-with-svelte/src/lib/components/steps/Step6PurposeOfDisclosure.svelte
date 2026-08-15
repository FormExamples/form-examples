<script lang="ts">
	import { authorization } from '#lib/stores/authorization.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = authorization.data.purposeOfDisclosure;
	const purposes = [
		{ value: 'eligibility-determination', label: 'Eligibility determination' },
		{ value: 'continuing-treatment', label: 'Continuing treatment' },
		{ value: 'insurance-claim', label: 'Insurance claim' },
		{ value: 'legal-proceeding', label: 'Legal proceeding' },
		{ value: 'personal-use', label: 'Personal use' },
		{ value: 'research', label: 'Research' },
		{ value: 'at-the-request-of-the-individual', label: 'At the request of the individual' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Purpose of disclosure">
	<p class="hint">Why is the information being requested?</p>

	<Field label="Primary purpose" required>
		<RadioGroup id="purposeOfDisclosure-primaryPurpose" label="Primary purpose">
			{#each purposes as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="purposeOfDisclosure-primaryPurpose" value={opt.value} bind:group={d.primaryPurpose} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.primaryPurpose === 'other'}
		<Field label="Other details" inputId="purposeOfDisclosure-otherDetails">
			<TextAreaInput
				id="purposeOfDisclosure-otherDetails"
				label="Other purpose details"
				rows={2}
				placeholder="If 'Other', explain the purpose here."
				bind:value={d.otherDetails}
			/>
		</Field>
	{/if}
</Fieldset>
