<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mentalHealthComorbidities;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const simpleQuestions: { key: keyof typeof m; name: string; label: string }[] = [
		{ key: 'bipolarDisorder', name: 'bipolarDisorder', label: 'Bipolar disorder?' },
		{ key: 'psychosis', name: 'psychosis', label: 'Psychosis?' },
		{ key: 'personalityDisorder', name: 'personalityDisorder', label: 'Personality disorder?' },
		{ key: 'eatingDisorder', name: 'eatingDisorder', label: 'Eating disorder?' },
		{ key: 'adhd', name: 'adhd', label: 'ADHD?' },
		{ key: 'selfHarmHistory', name: 'selfHarmHistory', label: 'History of self-harm?' },
		{ key: 'previousSuicideAttempts', name: 'previousSuicideAttempts', label: 'Previous suicide attempts?' }
	];
</script>

<Fieldset legend="Mental Health Comorbidities">
	<p class="hint">Co-occurring mental health conditions and risk factors.</p>

	<Field label="Depression?">
		<RadioGroup label="Depression?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="depression" value={opt.value} bind:group={m.depression} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.depression === 'yes'}
		<Field label="Depression severity" inputId="depressionSeverity">
			<Select id="depressionSeverity" label="Depression severity" bind:value={m.depressionSeverity}>
				<option value="">-- Select --</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	{/if}

	<Field label="Anxiety disorder?">
		<RadioGroup label="Anxiety disorder?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anxietyDisorder" value={opt.value} bind:group={m.anxietyDisorder} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.anxietyDisorder === 'yes'}
		<Field label="Anxiety disorder type" inputId="anxietyDisorderType">
			<Select id="anxietyDisorderType" label="Anxiety disorder type" bind:value={m.anxietyDisorderType}>
				<option value="">-- Select --</option>
				<option value="generalised">Generalised</option>
				<option value="social">Social</option>
				<option value="panic">Panic</option>
				<option value="ptsd">PTSD</option>
				<option value="ocd">OCD</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="PTSD?">
		<RadioGroup label="PTSD?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ptsd" value={opt.value} bind:group={m.ptsd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.ptsd === 'yes'}
		<Field label="PTSD details" inputId="ptsdDetails">
			<TextInput id="ptsdDetails" label="PTSD details" bind:value={m.ptsdDetails} />
		</Field>
	{/if}

	{#each simpleQuestions as q (q.name)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={m[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Suicidal ideation (ever)?">
		<RadioGroup label="Suicidal ideation (ever)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="suicidalIdeation" value={opt.value} bind:group={m.suicidalIdeation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.suicidalIdeation === 'yes'}
		<Field label="Current suicidal ideation?">
			<RadioGroup label="Current suicidal ideation?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="suicidalIdeationCurrent" value={opt.value} bind:group={m.suicidalIdeationCurrent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="On psychiatric medication?">
		<RadioGroup label="On psychiatric medication?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="psychiatricMedication" value={opt.value} bind:group={m.psychiatricMedication} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.psychiatricMedication === 'yes'}
		<Field label="Psychiatric medication details" inputId="psychiatricMedicationDetails">
			<TextInput id="psychiatricMedicationDetails" label="Psychiatric medication details" bind:value={m.psychiatricMedicationDetails} />
		</Field>
	{/if}
</Fieldset>
