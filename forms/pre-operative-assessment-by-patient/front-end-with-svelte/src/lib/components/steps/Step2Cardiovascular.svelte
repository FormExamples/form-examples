<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const c = assessment.data.cardiovascular;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular">
	<p class="hint">Heart and blood vessel conditions</p>
	<Field label="Do you have high blood pressure (hypertension)?"><RadioGroup label="Do you have high blood pressure (hypertension)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="htn" value={opt.value} bind:group={c.hypertension}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.hypertension === 'yes'}
		<Field label="Is it well controlled with medication?" required><RadioGroup label="Is it well controlled with medication?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="htnCtrl" value={opt.value} bind:group={c.hypertensionControlled} required/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you have ischaemic heart disease (angina, previous heart attack)?"><RadioGroup label="Do you have ischaemic heart disease (angina, previous heart attack)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ihd" value={opt.value} bind:group={c.ischemicHeartDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.ischemicHeartDisease === 'yes'}
		<Field label="Please provide details" inputId="ihdDetails"><TextInput id="ihdDetails" label="Please provide details" bind:value={c.ihdDetails} /></Field>
	{/if}

	<Field label="Do you have heart failure?"><RadioGroup label="Do you have heart failure?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hf" value={opt.value} bind:group={c.heartFailure}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.heartFailure === 'yes'}
		<Field label="NYHA Class" required inputId="nyha"><Select id="nyha" label="NYHA Class" required bind:value={c.heartFailureNYHA}><option value="">-- Select --</option>{#each [
				{ value: '1', label: 'Class I - No limitation' },
				{ value: '2', label: 'Class II - Mild limitation' },
				{ value: '3', label: 'Class III - Marked limitation' },
				{ value: '4', label: 'Class IV - Severe limitation' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Do you have any heart valve problems?"><RadioGroup label="Do you have any heart valve problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="valve" value={opt.value} bind:group={c.valvularDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.valvularDisease === 'yes'}
		<Field label="Please provide details" inputId="valveDetails"><TextInput id="valveDetails" label="Please provide details" bind:value={c.valvularDetails} /></Field>
	{/if}

	<Field label="Do you have an irregular heartbeat (arrhythmia)?"><RadioGroup label="Do you have an irregular heartbeat (arrhythmia)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="arrhy" value={opt.value} bind:group={c.arrhythmia}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.arrhythmia === 'yes'}
		<Field label="Type of arrhythmia" inputId="arrhyType"><TextInput id="arrhyType" label="Type of arrhythmia" bind:value={c.arrhythmiaType} /></Field>
	{/if}

	<Field label="Do you have a pacemaker or defibrillator?"><RadioGroup label="Do you have a pacemaker or defibrillator?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="pacemaker" value={opt.value} bind:group={c.pacemaker}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Have you had a heart attack in the last 6 months?"><RadioGroup label="Have you had a heart attack in the last 6 months?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="recentMI" value={opt.value} bind:group={c.recentMI}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.recentMI === 'yes'}
		<NumberInput label="How many weeks ago?" name="miWeeks" bind:value={c.recentMIWeeks} min={0} max={26} required />
	{/if}

	<Field label="Have you ever had heart or artery surgery?"><RadioGroup label="Have you ever had heart or artery surgery?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="heartSurgery" value={opt.value} bind:group={c.heartOrArterySurgery}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have swollen ankles?"><RadioGroup label="Do you have swollen ankles?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="swollenAnkles" value={opt.value} bind:group={c.swollenAnkles}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you get palpitations, blackouts or feel faint?"><RadioGroup label="Do you get palpitations, blackouts or feel faint?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="palpitations" value={opt.value} bind:group={c.palpitationsOrBlackouts}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
