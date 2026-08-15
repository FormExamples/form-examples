<script lang="ts">
	// Shared provider-details sub-form used by Step 1 (requesting) and Step 2
	// (receiving). The `provider` object is a live `$state` proxy reference from
	// the store, so binding its fields mutates the store directly.
	import type { ProviderDetails } from '#lib/engine/types.js';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	let {
		provider,
		idPrefix
	}: {
		provider: ProviderDetails;
		idPrefix: string;
	} = $props();

	const registrationBodies = [
		{ value: '', label: '— Select —' },
		{ value: 'GMC', label: 'GMC (General Medical Council)' },
		{ value: 'NMC', label: 'NMC (Nursing & Midwifery Council)' },
		{ value: 'HCPC', label: 'HCPC (Health & Care Professions Council)' },
		{ value: 'GPhC', label: 'GPhC (General Pharmaceutical Council)' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Field label="Clinician name" required inputId={`${idPrefix}-clinicianName`}>
	<TextInput
		id={`${idPrefix}-clinicianName`}
		label="Clinician name"
		required
		bind:value={provider.clinicianName}
	/>
</Field>

<div class="field-grid">
	<Field label="Role / job title" required inputId={`${idPrefix}-clinicianRole`}>
		<TextInput
			id={`${idPrefix}-clinicianRole`}
			label="Role / job title"
			required
			placeholder="e.g. Registrar, Charge Nurse"
			bind:value={provider.clinicianRole}
		/>
	</Field>
	<Field label="Ward / unit" inputId={`${idPrefix}-ward`}>
		<TextInput
			id={`${idPrefix}-ward`}
			label="Ward / unit"
			placeholder="e.g. AMU, Ward 7"
			bind:value={provider.ward}
		/>
	</Field>
</div>

<Field label="Organisation" required inputId={`${idPrefix}-organisation`}>
	<TextInput
		id={`${idPrefix}-organisation`}
		label="Organisation"
		required
		placeholder="e.g. NHS Trust, hospital, GP practice"
		bind:value={provider.organisation}
	/>
</Field>

<div class="field-grid">
	<Field label="Phone" required inputId={`${idPrefix}-phone`}>
		<TextInput id={`${idPrefix}-phone`} label="Phone" required bind:value={provider.phone} />
	</Field>
	<Field label="Email" inputId={`${idPrefix}-email`}>
		<TextInput id={`${idPrefix}-email`} label="Email" bind:value={provider.email} />
	</Field>
</div>

<div class="field-grid">
	<Field label="Registration body" inputId={`${idPrefix}-registrationBody`}>
		<Select
			id={`${idPrefix}-registrationBody`}
			label="Registration body"
			bind:value={provider.registrationBody}
		>
			{#each registrationBodies as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Registration number" inputId={`${idPrefix}-registrationNumber`}>
		<TextInput
			id={`${idPrefix}-registrationNumber`}
			label="Registration number"
			placeholder="e.g. GMC 1234567"
			bind:value={provider.registrationNumber}
		/>
	</Field>
</div>

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
