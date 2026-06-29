<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const r = assessment.data.respiratoryHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const copdSeverityOptions = [
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Respiratory History">
	<p class="hint">Previous respiratory conditions and diagnoses.</p>

	<Field label="Do you have asthma?">
		<RadioGroup label="Asthma">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="asthma" value={opt.value} bind:group={r.asthma} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have COPD?">
		<RadioGroup label="COPD">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="copd" value={opt.value} bind:group={r.copd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.copd === 'yes'}
		<Field label="COPD Severity" required inputId="copdSeverity">
			<Select id="copdSeverity" label="COPD severity" required bind:value={r.copdSeverity}>
				<option value="">-- Select --</option>
				{#each copdSeverityOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	{/if}

	<Field label="Do you have bronchiectasis?">
		<RadioGroup label="Bronchiectasis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bronchiectasis" value={opt.value} bind:group={r.bronchiectasis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have interstitial lung disease (ILD)?">
		<RadioGroup label="ILD">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ild" value={opt.value} bind:group={r.interstitialLungDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.interstitialLungDisease === 'yes'}
		<Field label="Type of ILD" inputId="ildType">
			<TextInput id="ildType" label="ILD type" bind:value={r.ildType} />
		</Field>
	{/if}

	<Field label="Have you had tuberculosis (TB)?">
		<RadioGroup label="TB">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tb" value={opt.value} bind:group={r.tuberculosis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.tuberculosis === 'yes'}
		<Field label="Was TB treatment completed?">
			<RadioGroup label="TB treatment complete">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tbComplete" value={opt.value} bind:group={r.tbTreatmentComplete} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Have you had pneumonia?">
		<RadioGroup label="Pneumonia">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pneumonia" value={opt.value} bind:group={r.pneumonia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.pneumonia === 'yes'}
		<Field label="Has pneumonia been recurrent?">
			<RadioGroup label="Pneumonia recurrent">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="pneumoniaRecurrent" value={opt.value} bind:group={r.pneumoniaRecurrent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Have you had a pulmonary embolism (PE)?">
		<RadioGroup label="PE">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pe" value={opt.value} bind:group={r.pulmonaryEmbolism} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.pulmonaryEmbolism === 'yes'}
		<Field label="Date of PE" inputId="peDate">
			<DateInput id="peDate" label="PE date" bind:value={r.peDate} />
		</Field>
	{/if}
</Fieldset>
