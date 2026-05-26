<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.arrhythmiaConduction;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Arrhythmia & Conduction">
	<p class="hint">Atrial fibrillation, pacemaker, syncope, and palpitations.</p>

	<Field label="Have you been diagnosed with atrial fibrillation?">
		<RadioGroup label="Have you been diagnosed with atrial fibrillation?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="af" value={opt.value} bind:group={a.atrialFibrillation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.atrialFibrillation === 'yes'}
		<Field label="Type of atrial fibrillation" required inputId="afType">
			<Select id="afType" label="Type of atrial fibrillation" required bind:value={a.afType}>
				<option value="">-- Select --</option>
				<option value="paroxysmal">Paroxysmal (intermittent)</option>
				<option value="persistent">Persistent</option>
				<option value="permanent">Permanent</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have any other arrhythmia?">
		<RadioGroup label="Do you have any other arrhythmia?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="otherArrhythmia" value={opt.value} bind:group={a.otherArrhythmia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.otherArrhythmia === 'yes'}
		<Field label="Type of arrhythmia" inputId="otherArrhythmiaType">
			<TextInput id="otherArrhythmiaType" label="Type of arrhythmia" bind:value={a.otherArrhythmiaType} />
		</Field>
	{/if}

	<Field label="Do you have a pacemaker or ICD (implantable cardioverter-defibrillator)?">
		<RadioGroup label="Do you have a pacemaker or ICD (implantable cardioverter-defibrillator)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pacemaker" value={opt.value} bind:group={a.pacemaker} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.pacemaker === 'yes'}
		<Field label="Device type" inputId="pacemakerType">
			<Select id="pacemakerType" label="Device type" bind:value={a.pacemakerType}>
				<option value="">-- Select --</option>
				<option value="single-chamber">Single chamber pacemaker</option>
				<option value="dual-chamber">Dual chamber pacemaker</option>
				<option value="biventricular">Biventricular (CRT)</option>
				<option value="icd">ICD</option>
			</Select>
		</Field>
	{/if}

	<Field label="Have you experienced syncope (fainting/blackouts)?">
		<RadioGroup label="Have you experienced syncope (fainting/blackouts)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="syncope" value={opt.value} bind:group={a.syncope} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.syncope === 'yes'}
		<Field label="Syncope details" inputId="syncopeDetails">
			<TextAreaInput id="syncopeDetails" label="Syncope details" rows={3} placeholder="Describe circumstances, frequency" bind:value={a.syncopeDetails} />
		</Field>
	{/if}

	<Field label="Do you experience palpitations?">
		<RadioGroup label="Do you experience palpitations?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="palpitations" value={opt.value} bind:group={a.palpitations} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
