<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const r = assessment.data.ckdRiskFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="CKD Risk Factors">
	<p class="hint">Conditions and exposures that raise the risk of chronic kidney disease.</p>

	<Field label="Hypertension?">
		<RadioGroup label="Hypertension?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="htn" value={opt.value} bind:group={r.hypertension} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Diabetes mellitus?">
		<RadioGroup label="Diabetes mellitus?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={r.diabetes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.diabetes === 'yes'}
		<Field label="Diabetes type" inputId="diabetesType">
			<Select id="diabetesType" label="Diabetes type" bind:value={r.diabetesType}>
				<option value="">— Select —</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
				<option value="gestational">Gestational</option>
				<option value="other">Other / unknown</option>
			</Select>
		</Field>
	{/if}

	<Field label="Cardiovascular disease (IHD, stroke, PAD)?">
		<RadioGroup label="Cardiovascular disease (IHD, stroke, PAD)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cvd" value={opt.value} bind:group={r.cardiovascularDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Family history of CKD?">
		<RadioGroup label="Family history of CKD?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fhCkd" value={opt.value} bind:group={r.familyHistoryCkd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Family history of polycystic kidney disease?">
		<RadioGroup label="Family history of polycystic kidney disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fhPkd" value={opt.value} bind:group={r.familyHistoryPolycysticKidney} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Prior episode of acute kidney injury (AKI)?">
		<RadioGroup label="Prior episode of acute kidney injury (AKI)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorAki" value={opt.value} bind:group={r.priorAki} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History of kidney stones?">
		<RadioGroup label="History of kidney stones?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="stones" value={opt.value} bind:group={r.kidneyStones} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Recurrent urinary tract infections?">
		<RadioGroup label="Recurrent urinary tract infections?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="uti" value={opt.value} bind:group={r.recurrentUti} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Autoimmune disease (e.g. SLE, vasculitis)?">
		<RadioGroup label="Autoimmune disease (e.g. SLE, vasculitis)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoimmune" value={opt.value} bind:group={r.autoimmuneDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.autoimmuneDisease === 'yes'}
		<Field label="Autoimmune disease details" inputId="autoimmuneDetails">
			<TextInput id="autoimmuneDetails" label="Autoimmune disease details" bind:value={r.autoimmuneDetails} />
		</Field>
	{/if}

	<Field label="Exposure to nephrotoxic drugs (aminoglycosides, contrast, chemotherapy, lithium)?">
		<RadioGroup label="Exposure to nephrotoxic drugs?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nephrotoxic" value={opt.value} bind:group={r.nephrotoxicDrugs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.nephrotoxicDrugs === 'yes'}
		<Field label="Which nephrotoxic drug(s)?" inputId="nephrotoxicDrugDetails">
			<TextInput id="nephrotoxicDrugDetails" label="Which nephrotoxic drug(s)?" bind:value={r.nephrotoxicDrugDetails} />
		</Field>
	{/if}

	<Field label="Regular NSAID use?">
		<RadioGroup label="Regular NSAID use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nsaid" value={opt.value} bind:group={r.nsaidUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Smoking status">
		<RadioGroup label="Smoking status">
			<label><input type="radio" class="radio-input" name="smoking" value="current" bind:group={r.smoking} /> Current smoker</label>
			<label><input type="radio" class="radio-input" name="smoking" value="ex" bind:group={r.smoking} /> Ex-smoker</label>
			<label><input type="radio" class="radio-input" name="smoking" value="never" bind:group={r.smoking} /> Never smoked</label>
		</RadioGroup>
	</Field>

	<Field label="Obesity (BMI ≥ 30)?">
		<RadioGroup label="Obesity (BMI ≥ 30)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="obesity" value={opt.value} bind:group={r.obesity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
