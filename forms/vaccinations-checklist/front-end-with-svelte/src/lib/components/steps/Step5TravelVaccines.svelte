<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.travelVaccines;
	const generic = t as unknown as Record<string, string>;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const travelVaccines = [
		{ key: 'yellowFeverVaccine', dateKey: 'yellowFeverVaccineDate', label: 'Yellow fever vaccine' },
		{ key: 'japaneseEncephalitisVaccine', dateKey: 'japaneseEncephalitisDate', label: 'Japanese encephalitis vaccine' },
		{ key: 'tickBorneEncephalitisVaccine', dateKey: 'tickBorneEncephalitisDate', label: 'Tick-borne encephalitis vaccine' },
		{ key: 'choleraVaccine', dateKey: 'choleraVaccineDate', label: 'Cholera vaccine' },
		{ key: 'meningococcalACWYTravel', dateKey: 'meningococcalACWYTravelDate', label: 'Meningococcal ACWY (travel)' }
	];
</script>

<Fieldset legend="Travel Vaccines">
	<p class="hint">Travel plans and destination-specific immunisations.</p>

	<Field label="Travel planned?">
		<RadioGroup label="Travel planned?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="travelPlanned" value={opt.value} bind:group={t.travelPlanned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.travelPlanned === 'yes'}
		<Field label="Destination" inputId="travelDestination">
			<TextInput id="travelDestination" label="Destination" bind:value={t.travelDestination} />
		</Field>
		<div class="field-grid">
			<Field label="Departure date" inputId="travelDeparture">
				<DateInput id="travelDeparture" label="Departure date" bind:value={t.travelDepartureDate} />
			</Field>
			<Field label="Return date" inputId="travelReturn">
				<DateInput id="travelReturn" label="Return date" bind:value={t.travelReturnDate} />
			</Field>
		</div>

		{#each travelVaccines as vac (vac.key)}
			<div class="vac-row">
				<Field label={vac.label}>
					<RadioGroup label={vac.label}>
						{#each yesNoUnknown as opt (opt.value)}
							<label><input type="radio" class="radio-input" name={vac.key} value={opt.value} bind:group={generic[vac.key]} /> {opt.label}</label>
						{/each}
					</RadioGroup>
				</Field>
				{#if generic[vac.key] === 'yes'}
					<Field label="Date" inputId={`${vac.key}-date`}>
						<DateInput id={`${vac.key}-date`} label={`${vac.label} date`} bind:value={generic[vac.dateKey]} />
					</Field>
				{/if}
			</div>
		{/each}

		{#if t.yellowFeverVaccine === 'yes'}
			<Field label="Yellow fever certificate held?">
				<RadioGroup label="Yellow fever certificate held?">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="yfCert" value={opt.value} bind:group={t.yellowFeverCertificate} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/if}

		<Field label="Malaria prophylaxis" inputId="malariaProphylaxis">
			<Select id="malariaProphylaxis" label="Malaria prophylaxis" bind:value={t.malariaProphylaxis}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="not-required">Not required</option>
			</Select>
		</Field>
		{#if t.malariaProphylaxis === 'yes'}
			<Field label="Malaria prophylaxis drug" inputId="malariaDrug">
				<Select id="malariaDrug" label="Malaria prophylaxis drug" bind:value={t.malariaProphylaxisDrug}>
					<option value="">-- Select --</option>
					<option value="atovaquone-proguanil">Atovaquone-proguanil</option>
					<option value="doxycycline">Doxycycline</option>
					<option value="mefloquine">Mefloquine</option>
					<option value="chloroquine">Chloroquine</option>
					<option value="other">Other</option>
				</Select>
			</Field>
		{/if}
	{/if}

	<Field label="Notes" inputId="travelNotes">
		<TextAreaInput id="travelNotes" label="Notes" rows={2} bind:value={t.notes} />
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
	.vac-row {
		border-bottom: 1px solid var(--color-base-300, #e5e7eb);
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
