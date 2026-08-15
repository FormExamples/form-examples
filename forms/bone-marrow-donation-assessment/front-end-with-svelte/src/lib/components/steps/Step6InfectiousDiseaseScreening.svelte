<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.infectiousDiseaseScreening;

	const screens: { key: keyof typeof d; label: string }[] = [
		{ key: 'hivStatus', label: 'HIV' },
		{ key: 'hepatitisBSurfaceAntigen', label: 'Hepatitis B surface antigen' },
		{ key: 'hepatitisBCoreAntibody', label: 'Hepatitis B core antibody' },
		{ key: 'hepatitisCAbntibody', label: 'Hepatitis C antibody' },
		{ key: 'htlvStatus', label: 'HTLV' },
		{ key: 'syphilisScreen', label: 'Syphilis' },
		{ key: 'cmvStatus', label: 'CMV' },
		{ key: 'ebvStatus', label: 'EBV' },
		{ key: 'toxoplasmaStatus', label: 'Toxoplasma' },
		{ key: 'tuberculosisScreen', label: 'Tuberculosis' }
	];
</script>

<Fieldset legend="Infectious Disease Screening">
	<p class="hint">Mandatory donor microbiology screening results.</p>

	<div class="grid">
		{#each screens as s (s.key)}
			<Field label={s.label} inputId={String(s.key)}>
				<Select id={String(s.key)} label={s.label} bind:value={d[s.key] as string}>
					<option value="">Select…</option>
					<option value="negative">Negative</option>
					<option value="positive">Positive</option>
					<option value="pending">Pending</option>
				</Select>
			</Field>
		{/each}
	</div>

	<Field label="Recent Travel" inputId="recentTravel">
		<Select id="recentTravel" label="Recent Travel" bind:value={d.recentTravel}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.recentTravel === 'yes'}
		<Field label="Travel details" inputId="travelDetails">
			<TextInput id="travelDetails" label="Travel details" bind:value={d.travelDetails} />
		</Field>
	{/if}

	<Field label="Recent Infection" inputId="recentInfection">
		<Select id="recentInfection" label="Recent Infection" bind:value={d.recentInfection}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.recentInfection === 'yes'}
		<Field label="Infection details" inputId="infectionDetails">
			<TextInput id="infectionDetails" label="Infection details" bind:value={d.infectionDetails} />
		</Field>
	{/if}

	<Field label="Vaccinations up to date" inputId="vaccinationUpToDate">
		<Select id="vaccinationUpToDate" label="Vaccinations up to date" bind:value={d.vaccinationUpToDate}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
