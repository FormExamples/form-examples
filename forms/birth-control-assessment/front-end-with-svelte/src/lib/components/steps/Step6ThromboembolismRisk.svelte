<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const t = assessment.data.thromboembolismRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Thromboembolism Risk" description="Clotting history and risk factors.">
	<RadioGroup label="Previous deep vein thrombosis (DVT)?" name="previousDVT" options={yesNo} bind:value={t.previousDVT} />
	{#if t.previousDVT === 'yes'}
		<TextInput label="DVT details" name="dvtDetails" placeholder="e.g. Left leg 2019, post-surgery" bind:value={t.dvtDetails} />
	{/if}

	<RadioGroup label="Previous pulmonary embolism (PE)?" name="previousPE" options={yesNo} bind:value={t.previousPE} />
	{#if t.previousPE === 'yes'}
		<TextInput label="PE details" name="peDetails" bind:value={t.peDetails} />
	{/if}

	<RadioGroup label="Known thrombophilia (clotting disorder)?" name="knownThrombophilia" options={yesNo} bind:value={t.knownThrombophilia} />
	{#if t.knownThrombophilia === 'yes'}
		<Field label="Thrombophilia type" inputId="thrombophiliaType">
			<Select id="thrombophiliaType" label="Thrombophilia type" bind:value={t.thrombophiliaType}>
				<option value="">-- Select --</option>
				<option value="factor-v-leiden">Factor V Leiden</option>
				<option value="prothrombin-mutation">Prothrombin mutation</option>
				<option value="protein-c-deficiency">Protein C deficiency</option>
				<option value="protein-s-deficiency">Protein S deficiency</option>
				<option value="antithrombin-deficiency">Antithrombin deficiency</option>
				<option value="antiphospholipid">Antiphospholipid syndrome</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<RadioGroup label="Prolonged immobility (wheelchair, bed-bound)?" name="immobilityRisk" options={yesNo} bind:value={t.immobilityRisk} />
	{#if t.immobilityRisk === 'yes'}
		<TextInput label="Immobility details" name="immobilityDetails" bind:value={t.immobilityDetails} />
	{/if}

	<RadioGroup label="Recent major surgery?" name="recentMajorSurgery" options={yesNo} bind:value={t.recentMajorSurgery} />
	{#if t.recentMajorSurgery === 'yes'}
		<TextInput label="Surgery details" name="surgeryDetails" bind:value={t.surgeryDetails} />
	{/if}

	<RadioGroup label="Frequent long-haul travel (over 4 hours)?" name="longHaulTravel" options={yesNo} bind:value={t.longHaulTravel} />
</Fieldset>
