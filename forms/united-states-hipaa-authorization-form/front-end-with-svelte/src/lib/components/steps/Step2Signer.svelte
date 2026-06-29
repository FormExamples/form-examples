<script lang="ts">
	import { authorization } from '$lib/stores/authorization.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = authorization.data.signer;
	const relationships = [
		{ value: 'self', label: 'Self' },
		{ value: 'parent-of-minor', label: 'Parent of a minor' },
		{ value: 'guardian', label: 'Guardian' },
		{ value: 'power-of-attorney', label: 'Power of attorney' },
		{ value: 'other-authorized-representative', label: 'Other authorized representative' }
	];
</script>

<Fieldset legend="Signer identification">
	<p class="hint">Who is signing this authorization?</p>

	<Field label="I am signing as" required>
		<RadioGroup id="signer-relationship" label="I am signing as">
			{#each relationships as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="signer-relationship" value={opt.value} bind:group={d.relationship} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.relationship !== '' && d.relationship !== 'self'}
		<Field label="Representative name" inputId="signer-representativeName">
			<TextInput id="signer-representativeName" label="Representative name" bind:value={d.representativeName} />
		</Field>

		<Field label="Representative authority description" inputId="signer-representativeAuthorityDescription">
			<TextAreaInput
				id="signer-representativeAuthorityDescription"
				label="Representative authority description"
				rows={2}
				placeholder="Describe the legal basis (e.g., court order, durable POA)."
				bind:value={d.representativeAuthorityDescription}
			/>
		</Field>
	{/if}
</Fieldset>
