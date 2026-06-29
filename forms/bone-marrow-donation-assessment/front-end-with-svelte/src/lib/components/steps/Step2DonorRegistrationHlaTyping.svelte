<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.donorRegistrationHlaTyping;
</script>

<Fieldset legend="Donor Registration & HLA Typing">
	<p class="hint">Registry details and HLA tissue-typing results.</p>

	<div class="grid">
		<Field label="Donor Registry" inputId="donorRegistry">
			<TextInput id="donorRegistry" label="Donor Registry" bind:value={d.donorRegistry} />
		</Field>
		<Field label="Registry ID" inputId="donorRegistryId">
			<TextInput id="donorRegistryId" label="Registry ID" bind:value={d.donorRegistryId} />
		</Field>
	</div>

	<div class="grid">
		<Field label="Registration Date" inputId="registrationDate">
			<DateInput id="registrationDate" label="Registration Date" bind:value={d.registrationDate} />
		</Field>
		<Field label="Donation Type" inputId="donationType">
			<Select id="donationType" label="Donation Type" bind:value={d.donationType}>
				<option value="">Select…</option>
				<option value="allogeneic">Allogeneic</option>
				<option value="autologous">Autologous</option>
			</Select>
		</Field>
	</div>

	<Field label="Recipient Relationship" inputId="recipientRelationship">
		<Select id="recipientRelationship" label="Recipient Relationship" bind:value={d.recipientRelationship}>
			<option value="">Select…</option>
			<option value="related">Related</option>
			<option value="unrelated">Unrelated</option>
		</Select>
	</Field>

	<div class="grid grid-3">
		<Field label="HLA-A" inputId="hlaA"><TextInput id="hlaA" label="HLA-A" bind:value={d.hlaA} /></Field>
		<Field label="HLA-B" inputId="hlaB"><TextInput id="hlaB" label="HLA-B" bind:value={d.hlaB} /></Field>
		<Field label="HLA-C" inputId="hlaC"><TextInput id="hlaC" label="HLA-C" bind:value={d.hlaC} /></Field>
		<Field label="HLA-DRB1" inputId="hlaDrb1"><TextInput id="hlaDrb1" label="HLA-DRB1" bind:value={d.hlaDrb1} /></Field>
		<Field label="HLA-DQB1" inputId="hlaDqb1"><TextInput id="hlaDqb1" label="HLA-DQB1" bind:value={d.hlaDqb1} /></Field>
		<Field label="HLA-DPB1" inputId="hlaDpb1"><TextInput id="hlaDpb1" label="HLA-DPB1" bind:value={d.hlaDpb1} /></Field>
	</div>

	<div class="grid">
		<Field label="HLA Match Level" inputId="hlaMatchLevel">
			<Select id="hlaMatchLevel" label="HLA Match Level" bind:value={d.hlaMatchLevel}>
				<option value="">Select…</option>
				<option value="10-of-10">10/10 (Full Match)</option>
				<option value="9-of-10">9/10</option>
				<option value="8-of-10">8/10</option>
				<option value="7-of-10">7/10</option>
				<option value="haploidentical">Haploidentical</option>
			</Select>
		</Field>
		<Field label="Crossmatch Result" inputId="crossmatchResult">
			<Select id="crossmatchResult" label="Crossmatch Result" bind:value={d.crossmatchResult}>
				<option value="">Select…</option>
				<option value="negative">Negative</option>
				<option value="positive">Positive</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	</div>

	<Field label="Previous Donation" inputId="previousDonation">
		<Select id="previousDonation" label="Previous Donation" bind:value={d.previousDonation}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.previousDonation === 'yes'}
		<Field label="Previous Donation Details" inputId="previousDonationDetails">
			<TextAreaInput id="previousDonationDetails" label="Previous Donation Details" rows={2} bind:value={d.previousDonationDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
