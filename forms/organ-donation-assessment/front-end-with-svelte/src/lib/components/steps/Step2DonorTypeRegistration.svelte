<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.donorTypeRegistration;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="2. Donor Type & Registration">
	<p class="hint">Living vs deceased donor, donor register details, and (for living) recipient relationship.</p>

	<Field label="Donor type" required>
		<RadioGroup label="Donor type">
			<label><input type="radio" class="radio-input" name="donorType" value="living" bind:group={d.donorType} id="donorType" /> Living donor</label>
			<label><input type="radio" class="radio-input" name="donorType" value="deceased" bind:group={d.donorType} /> Deceased donor</label>
		</RadioGroup>
	</Field>

	<Field label="Registered on a donor register?">
		<RadioGroup label="Registered on a donor register?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="registeredOnDonorRegister" value={opt.value} bind:group={d.registeredOnDonorRegister} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.registeredOnDonorRegister === 'yes'}
		<div class="field-grid">
			<Field label="Registry name" inputId="registryName">
				<TextInput id="registryName" label="Registry name" placeholder="e.g. NHS Organ Donor Register" bind:value={d.registryName} />
			</Field>
			<Field label="Registration date" inputId="registrationDate">
				<DateInput id="registrationDate" label="Registration date" bind:value={d.registrationDate} />
			</Field>
		</div>
	{/if}

	{#if d.donorType === 'living'}
		<Field label="Recipient relationship (living donor)" inputId="recipientRelationship">
			<Select id="recipientRelationship" label="Recipient relationship" bind:value={d.recipientRelationship}>
				<option value="">-- Select --</option>
				<option value="spouse-partner">Spouse / partner</option>
				<option value="parent">Parent</option>
				<option value="child">Adult child</option>
				<option value="sibling">Sibling</option>
				<option value="other-relative">Other relative</option>
				<option value="friend">Friend / known but not related</option>
				<option value="altruistic">Altruistic / non-directed</option>
				<option value="paired-pooled">Paired / pooled exchange</option>
			</Select>
		</Field>
		<Field label="Recipient name (if known)" inputId="recipientName">
			<TextInput id="recipientName" label="Recipient name" bind:value={d.recipientName} />
		</Field>
	{/if}

	<Field label="Have you previously donated organs / tissue?">
		<RadioGroup label="Have you previously donated organs / tissue?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousDonation" value={opt.value} bind:group={d.previousDonation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.previousDonation === 'yes'}
		<Field label="Previous donation details" inputId="previousDonationDetails">
			<TextAreaInput id="previousDonationDetails" label="Previous donation details" rows={2} placeholder="When, where, organ/tissue, recipient outcome…" bind:value={d.previousDonationDetails} />
		</Field>
	{/if}

	<Field label="Intended organ(s) for donation" inputId="intendedOrgans">
		<TextAreaInput id="intendedOrgans" label="Intended organ(s) for donation" rows={2} placeholder="e.g. kidney, liver lobe, heart, lung, pancreas…" bind:value={d.intendedOrgans} />
	</Field>
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
