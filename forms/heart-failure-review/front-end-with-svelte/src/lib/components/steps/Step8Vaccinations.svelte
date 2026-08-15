<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const v = assessment.data.vaccinations;
</script>

<Fieldset legend="Step 8 of 9 — Vaccinations and self-management">
	<p class="hint">Vaccination status, lifestyle, and self-management.</p>

	<Field label="Influenza vaccination up to date" inputId="vaccinations-influenzaVaccination">
		<Select
			id="vaccinations-influenzaVaccination"
			label="Influenza vaccination up to date"
			bind:value={v.influenzaVaccination}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Pneumococcal vaccination up to date" inputId="vaccinations-pneumococcalVaccination">
		<Select
			id="vaccinations-pneumococcalVaccination"
			label="Pneumococcal vaccination up to date"
			bind:value={v.pneumococcalVaccination}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="COVID-19 vaccination up to date" inputId="vaccinations-covidVaccination">
		<Select
			id="vaccinations-covidVaccination"
			label="COVID-19 vaccination up to date"
			bind:value={v.covidVaccination}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Smoking status" inputId="vaccinations-smokingStatus">
		<Select id="vaccinations-smokingStatus" label="Smoking status" bind:value={v.smokingStatus}>
			<option value="">— Select —</option>
			<option value="never">Never</option>
			<option value="ex">Ex-smoker</option>
			<option value="current">Current</option>
		</Select>
	</Field>

	<Field label="Alcohol use" inputId="vaccinations-alcoholStatus">
		<Select id="vaccinations-alcoholStatus" label="Alcohol use" bind:value={v.alcoholStatus}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="within-limits">Within limits</option>
			<option value="above-limits">Above limits</option>
		</Select>
	</Field>

	<Field label="Monitors daily weights" inputId="vaccinations-dailyWeights">
		<Select id="vaccinations-dailyWeights" label="Monitors daily weights" bind:value={v.dailyWeights}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Self-management plan in place" inputId="vaccinations-selfManagementPlan">
		<Select
			id="vaccinations-selfManagementPlan"
			label="Self-management plan in place"
			bind:value={v.selfManagementPlan}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Cardiac rehabilitation attended / referred" inputId="vaccinations-cardiacRehab">
		<Select
			id="vaccinations-cardiacRehab"
			label="Cardiac rehabilitation attended / referred"
			bind:value={v.cardiacRehab}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
