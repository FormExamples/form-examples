<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.authoringClinician;
	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'final', label: 'Final' }
	];
</script>

<Fieldset legend="Authoring Clinician & Signoff">
	<p class="hint">Identifies the clinician responsible for compiling and signing this IPS.</p>

	<div class="field-grid">
		<Field label="Clinician name" required inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician name" required bind:value={d.clinicianName} />
		</Field>
		<Field label="Role / specialty" inputId="clinicianRole">
			<TextInput id="clinicianRole" label="Role / specialty" placeholder="e.g. General Practitioner" bind:value={d.clinicianRole} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Organisation" inputId="organisation">
			<TextInput id="organisation" label="Organisation" bind:value={d.organisation} />
		</Field>
		<Field label="Country (ISO 3166)" inputId="authoringCountry">
			<TextInput id="authoringCountry" label="Country" placeholder="e.g. GB" bind:value={d.country} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Clinician email" inputId="email">
			<TextInput id="email" label="Clinician email" type="email" bind:value={d.email} />
		</Field>
		<Field label="Clinician phone" inputId="phone">
			<TextInput id="phone" label="Clinician phone" type="tel" bind:value={d.phone} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Signoff date" inputId="signoffDate">
			<DateInput id="signoffDate" label="Signoff date" bind:value={d.signoffDate} />
		</Field>
		<Field label="Authoring status" inputId="authoringStatus">
			<Select id="authoringStatus" label="Authoring status" bind:value={d.authoringStatus}>
				<option value="">— Select —</option>
				{#each statusOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
	</div>
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
