<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.childhoodImmunisations as unknown as Record<string, string>;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];

	const vaccines = [
		{ key: 'mmrDose1', dateKey: 'mmrDose1Date', label: 'MMR dose 1' },
		{ key: 'mmrDose2', dateKey: 'mmrDose2Date', label: 'MMR dose 2' },
		{ key: 'dtpPrimaryCourse', dateKey: 'dtpPrimaryDate', label: 'DTP primary course' },
		{ key: 'dtpBooster', dateKey: 'dtpBoosterDate', label: 'DTP booster' },
		{ key: 'polioPrimaryCourse', dateKey: 'polioPrimaryDate', label: 'Polio primary course' },
		{ key: 'polioBooster', dateKey: 'polioBoosterDate', label: 'Polio booster' },
		{ key: 'hibVaccine', dateKey: 'hibVaccineDate', label: 'Hib vaccine' },
		{ key: 'menCVaccine', dateKey: 'menCVaccineDate', label: 'MenC vaccine' },
		{ key: 'menACWYVaccine', dateKey: 'menACWYVaccineDate', label: 'MenACWY vaccine' },
		{ key: 'pcvVaccine', dateKey: 'pcvVaccineDate', label: 'PCV (pneumococcal) vaccine' }
	];
</script>

<Fieldset legend="Childhood Immunisations">
	<p class="hint">Routine childhood schedule. Record status and, where known, the date.</p>

	{#each vaccines as vac (vac.key)}
		<div class="vac-row">
			<Field label={vac.label}>
				<RadioGroup label={vac.label}>
					{#each yesNoUnknown as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={vac.key} value={opt.value} bind:group={c[vac.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			{#if c[vac.key] === 'yes'}
				<Field label="Date" inputId={`${vac.key}-date`}>
					<DateInput id={`${vac.key}-date`} label={`${vac.label} date`} bind:value={c[vac.dateKey]} />
				</Field>
			{/if}
		</div>
	{/each}

	<Field label="Notes" inputId="childhoodNotes">
		<TextAreaInput id="childhoodNotes" label="Notes" rows={2} bind:value={c.notes} />
	</Field>
</Fieldset>

<style>
	.vac-row {
		border-bottom: 1px solid var(--color-base-300, #e5e7eb);
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
