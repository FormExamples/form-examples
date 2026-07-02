<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const v = assessment.data.vaccinations;
</script>

<Fieldset legend="Step 8 of 11 — Vaccinations">
	<p class="hint">Seasonal influenza, pneumococcal, and COVID-19 status.</p>

	<Field label="Seasonal influenza" inputId="vaccinations-influenzaVaccine">
		<Select
			id="vaccinations-influenzaVaccine"
			label="Seasonal influenza"
			bind:value={v.influenzaVaccine}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="due">Due</option>
			<option value="declined">Declined</option>
		</Select>
	</Field>

	<Field label="Pneumococcal" inputId="vaccinations-pneumococcalVaccine">
		<Select
			id="vaccinations-pneumococcalVaccine"
			label="Pneumococcal"
			bind:value={v.pneumococcalVaccine}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="due">Due</option>
			<option value="declined">Declined</option>
		</Select>
	</Field>

	<Field label="COVID-19" inputId="vaccinations-covidVaccine">
		<Select id="vaccinations-covidVaccine" label="COVID-19" bind:value={v.covidVaccine}>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="due">Due</option>
			<option value="declined">Declined</option>
		</Select>
	</Field>
</Fieldset>
