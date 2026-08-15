<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.contraindicationsAllergies;
	const generic = a as unknown as Record<string, string>;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const allergies = [
		{ key: 'gelatinAllergy', label: 'Gelatin allergy' },
		{ key: 'neomycinAllergy', label: 'Neomycin allergy' },
		{ key: 'latexAllergy', label: 'Latex allergy' },
		{ key: 'yeastAllergy', label: 'Yeast allergy' },
		{ key: 'pegPolysorbateAllergy', label: 'PEG / polysorbate allergy' }
	];
</script>

<Fieldset legend="Contraindications & Allergies">
	<p class="hint">Allergies and conditions that may contraindicate specific vaccines.</p>

	<Field label="Egg allergy?">
		<RadioGroup label="Egg allergy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eggAllergy" value={opt.value} bind:group={a.eggAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.eggAllergy === 'yes'}
		<Field label="Egg allergy severity" inputId="eggSeverity">
			<Select id="eggSeverity" label="Egg allergy severity" bind:value={a.eggAllergySeverity}>
				<option value="">-- Select --</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
				<option value="anaphylaxis">Anaphylaxis</option>
			</Select>
		</Field>
	{/if}

	{#each allergies as al (al.key)}
		<Field label={al.label}>
			<RadioGroup label={al.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={al.key} value={opt.value} bind:group={generic[al.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Other vaccine allergies" inputId="otherAllergies">
		<TextInput id="otherAllergies" label="Other vaccine allergies" bind:value={a.otherVaccineAllergies} />
	</Field>

	<Field label="History of Guillain-Barré Syndrome (GBS)?">
		<RadioGroup label="History of Guillain-Barré Syndrome?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gbs" value={opt.value} bind:group={a.historyOfGBS} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.historyOfGBS === 'yes'}
		<Field label="GBS details" inputId="gbsDetails">
			<TextAreaInput id="gbsDetails" label="GBS details" rows={2} bind:value={a.gbsDetails} />
		</Field>
	{/if}

	<Field label="On immunosuppressants?">
		<RadioGroup label="On immunosuppressants?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunosupp" value={opt.value} bind:group={a.onImmunosuppressants} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.onImmunosuppressants === 'yes'}
		<Field label="Immunosuppressant details" inputId="immunosuppDetails">
			<TextAreaInput id="immunosuppDetails" label="Immunosuppressant details" rows={2} bind:value={a.immunosuppressantDetails} />
		</Field>
	{/if}

	<Field label="Recent blood products?">
		<RadioGroup label="Recent blood products?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bloodProducts" value={opt.value} bind:group={a.onBloodProductsRecent} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.onBloodProductsRecent === 'yes'}
		<Field label="Blood products details" inputId="bloodDetails">
			<TextAreaInput id="bloodDetails" label="Blood products details" rows={2} bind:value={a.bloodProductsDetails} />
		</Field>
	{/if}

	<Field label="Live vaccines contraindicated?">
		<RadioGroup label="Live vaccines contraindicated?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="liveContra" value={opt.value} bind:group={a.liveVaccineContraindicated} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.liveVaccineContraindicated === 'yes'}
		<Field label="Contraindication reason" inputId="liveReason">
			<TextAreaInput id="liveReason" label="Contraindication reason" rows={2} bind:value={a.liveVaccineContraindicationReason} />
		</Field>
	{/if}

	<Field label="Notes" inputId="contraNotes">
		<TextAreaInput id="contraNotes" label="Notes" rows={2} bind:value={a.notes} />
	</Field>
</Fieldset>
