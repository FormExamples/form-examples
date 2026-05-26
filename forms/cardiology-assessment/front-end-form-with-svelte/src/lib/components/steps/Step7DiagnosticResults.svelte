<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const d = assessment.data.diagnosticResults;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Diagnostic Results">
	<p class="hint">ECG, echocardiography, stress test, and catheterization findings.</p>

	<Field label="Is the ECG normal?">
		<RadioGroup label="Is the ECG normal?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ecgNormal" value={opt.value} bind:group={d.ecgNormal} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.ecgNormal === 'no'}
		<Field label="ECG findings" inputId="ecgFindings">
			<TextAreaInput id="ecgFindings" label="ECG findings" rows={3} placeholder="e.g. ST depression, LBBB, AF" bind:value={d.ecgFindings} />
		</Field>
	{/if}

	<Field label="Has an echocardiogram been performed?">
		<RadioGroup label="Has an echocardiogram been performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="echoPerformed" value={opt.value} bind:group={d.echoPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.echoPerformed === 'yes'}
		<Field label="Left ventricular ejection fraction (LVEF) (%)" inputId="echoLVEF">
			<NumberInput id="echoLVEF" label="Left ventricular ejection fraction (LVEF)" min={5} max={80} bind:value={d.echoLVEF} />
		</Field>
		<Field label="Echocardiogram findings" inputId="echoFindings">
			<TextAreaInput id="echoFindings" label="Echocardiogram findings" rows={3} placeholder="e.g. Wall motion abnormalities, valve issues" bind:value={d.echoFindings} />
		</Field>
	{/if}

	<Field label="Has a stress test been performed?">
		<RadioGroup label="Has a stress test been performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="stressTest" value={opt.value} bind:group={d.stressTestPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.stressTestPerformed === 'yes'}
		<Field label="Stress test result" required inputId="stressTestResult">
			<Select id="stressTestResult" label="Stress test result" required bind:value={d.stressTestResult}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
				<option value="inconclusive">Inconclusive</option>
			</Select>
		</Field>
		<Field label="Stress test details" inputId="stressTestDetails">
			<TextAreaInput id="stressTestDetails" label="Stress test details" rows={3} placeholder="e.g. Ischaemic changes, METs achieved" bind:value={d.stressTestDetails} />
		</Field>
	{/if}

	<Field label="Has cardiac catheterization been performed?">
		<RadioGroup label="Has cardiac catheterization been performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cathPerformed" value={opt.value} bind:group={d.cathPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.cathPerformed === 'yes'}
		<Field label="Catheterization findings" inputId="cathFindings">
			<TextAreaInput id="cathFindings" label="Catheterization findings" rows={3} placeholder="e.g. LAD 80% stenosis, RCA 50% stenosis" bind:value={d.cathFindings} />
		</Field>
	{/if}
</Fieldset>
