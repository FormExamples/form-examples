<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mentalStatusExam;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const moodOptions = [
		{ value: 'euthymic', label: 'Euthymic (normal)' },
		{ value: 'depressed', label: 'Depressed' },
		{ value: 'elevated', label: 'Elevated' },
		{ value: 'irritable', label: 'Irritable' },
		{ value: 'anxious', label: 'Anxious' },
		{ value: 'flat', label: 'Flat' }
	];
	const affectOptions = [
		{ value: 'congruent', label: 'Congruent' },
		{ value: 'incongruent', label: 'Incongruent' },
		{ value: 'restricted', label: 'Restricted' },
		{ value: 'blunted', label: 'Blunted' },
		{ value: 'flat', label: 'Flat' },
		{ value: 'labile', label: 'Labile' }
	];
	const thoughtProcessOptions = [
		{ value: 'linear', label: 'Linear and goal-directed' },
		{ value: 'circumstantial', label: 'Circumstantial' },
		{ value: 'tangential', label: 'Tangential' },
		{ value: 'loosening', label: 'Loosening of associations' },
		{ value: 'flight-of-ideas', label: 'Flight of ideas' },
		{ value: 'thought-blocking', label: 'Thought blocking' }
	];
	const insightOptions = [
		{ value: 'full', label: 'Full insight' },
		{ value: 'partial', label: 'Partial insight' },
		{ value: 'none', label: 'No insight' }
	];
	const judgementOptions = [
		{ value: 'intact', label: 'Intact' },
		{ value: 'impaired', label: 'Impaired' },
		{ value: 'poor', label: 'Poor' }
	];
</script>

<Fieldset legend="Mental Status Examination">
	<p class="hint">Systematic assessment of mental state.</p>

	<Field label="Appearance" inputId="appearance">
		<TextInput id="appearance" label="Appearance" bind:value={m.appearance} />
	</Field>
	<Field label="Behaviour" inputId="behaviour">
		<TextInput id="behaviour" label="Behaviour" bind:value={m.behaviour} />
	</Field>
	<Field label="Speech" inputId="speech">
		<TextInput id="speech" label="Speech" bind:value={m.speech} />
	</Field>

	<Field label="Mood (patient-reported)" inputId="mood">
		<Select id="mood" label="Mood" bind:value={m.mood}>
			<option value="">-- Select --</option>
			{#each moodOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Affect (observed)" inputId="affect">
		<Select id="affect" label="Affect" bind:value={m.affect}>
			<option value="">-- Select --</option>
			{#each affectOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Thought Process" inputId="thoughtProcess">
		<Select id="thoughtProcess" label="Thought process" bind:value={m.thoughtProcess}>
			<option value="">-- Select --</option>
			{#each thoughtProcessOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Thought Content" inputId="thoughtContent">
		<TextAreaInput id="thoughtContent" label="Thought content" rows={3} bind:value={m.thoughtContent} />
	</Field>

	<Field label="Perceptual disturbances (hallucinations, illusions)?">
		<RadioGroup label="Perceptual disturbances">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="perceptual" value={opt.value} bind:group={m.perceptualDisturbances} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.perceptualDisturbances === 'yes'}
		<Field label="Perceptual Disturbance Details" inputId="perceptualDetails">
			<TextAreaInput id="perceptualDetails" label="Perceptual details" rows={3} bind:value={m.perceptualDetails} />
		</Field>
	{/if}

	<Field label="Is cognition intact?">
		<RadioGroup label="Cognition intact">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cognition" value={opt.value} bind:group={m.cognitionIntact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.cognitionIntact === 'no'}
		<Field label="Cognitive Impairment Details" inputId="cognitionDetails">
			<TextAreaInput id="cognitionDetails" label="Cognition details" rows={3} bind:value={m.cognitionDetails} />
		</Field>
	{/if}

	<Field label="Insight" inputId="insight">
		<Select id="insight" label="Insight" bind:value={m.insight}>
			<option value="">-- Select --</option>
			{#each insightOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Judgement" inputId="judgement">
		<Select id="judgement" label="Judgement" bind:value={m.judgement}>
			<option value="">-- Select --</option>
			{#each judgementOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
</Fieldset>
