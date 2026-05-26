<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const r = assessment.data.respiratory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Respiratory">
	<p class="hint">Lung and breathing conditions</p>
	<Field label="Do you have asthma?"><RadioGroup label="Do you have asthma?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="asthma" value={opt.value} bind:group={r.asthma}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.asthma === 'yes'}
		<Field label="How frequent are your symptoms?" required inputId="asthmaFreq"><Select id="asthmaFreq" label="How frequent are your symptoms?" required bind:value={r.asthmaFrequency}><option value="">-- Select --</option>{#each [
				{ value: 'intermittent', label: 'Intermittent' },
				{ value: 'mild-persistent', label: 'Mild persistent' },
				{ value: 'moderate-persistent', label: 'Moderate persistent' },
				{ value: 'severe-persistent', label: 'Severe persistent' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Do you have COPD (chronic bronchitis / emphysema)?"><RadioGroup label="Do you have COPD (chronic bronchitis / emphysema)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="copd" value={opt.value} bind:group={r.copd}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.copd === 'yes'}
		<Field label="COPD Severity" required inputId="copdSev"><Select id="copdSev" label="COPD Severity" required bind:value={r.copdSeverity}><option value="">-- Select --</option>{#each [
				{ value: 'mild', label: 'Mild' },
				{ value: 'moderate', label: 'Moderate' },
				{ value: 'severe', label: 'Severe' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Do you have obstructive sleep apnoea (OSA)?"><RadioGroup label="Do you have obstructive sleep apnoea (OSA)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="osa" value={opt.value} bind:group={r.osa}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.osa === 'yes'}
		<Field label="Do you use a CPAP machine?"><RadioGroup label="Do you use a CPAP machine?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cpap" value={opt.value} bind:group={r.osaCPAP}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you smoke?"><RadioGroup label="Do you smoke?">{#each [
			{ value: 'current', label: 'Current smoker' },
			{ value: 'ex', label: 'Ex-smoker' },
			{ value: 'never', label: 'Never smoked' }
		] as opt (opt.value)}<label><input type="radio" class="radio-input" name="smoking" value={opt.value} bind:group={r.smoking}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.smoking === 'current' || r.smoking === 'ex'}
		<NumberInput label="Pack-years" name="packYears" bind:value={r.smokingPackYears} min={0} max={200} />
	{/if}

	<Field label="Have you had a recent upper respiratory tract infection (cold/flu)?"><RadioGroup label="Have you had a recent upper respiratory tract infection (cold/flu)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="urti" value={opt.value} bind:group={r.recentURTI}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
