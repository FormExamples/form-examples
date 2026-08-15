<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { estimateMETs } from '#lib/engine/utils.js';

	const f = assessment.data.functionalCapacity;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	$effect(() => {
		assessment.data.functionalCapacity.estimatedMETs = estimateMETs(f.exerciseTolerance);
	});
</script>

<Fieldset legend="Functional Capacity">
	<p class="hint">Your ability to perform daily activities and exercise</p>
	<Field label="What is the most strenuous activity you can do without becoming short of breath?" inputId="exercise"><Select id="exercise" label="What is the most strenuous activity you can do without becoming short of breath?" bind:value={f.exerciseTolerance}><option value="">-- Select --</option>{#each [
			{ value: 'unable', label: 'Unable to perform daily activities' },
			{ value: 'light-housework', label: 'Light housework / walking around the house' },
			{ value: 'climb-stairs', label: 'Climb a flight of stairs / walk uphill' },
			{ value: 'moderate-exercise', label: 'Moderate exercise (jogging, cycling)' },
			{ value: 'vigorous-exercise', label: 'Vigorous exercise (running, swimming laps)' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	{#if f.estimatedMETs !== null}
		<div class="mb-4 rounded-lg border border-info bg-info/10 p-3 text-sm">
			Estimated METs: <strong>{f.estimatedMETs}</strong>
			{#if f.estimatedMETs < 4}
				<span class="ml-2 text-warning">(Poor functional capacity - &lt;4 METs)</span>
			{:else}
				<span class="ml-2 text-success">(Adequate functional capacity - &ge;4 METs)</span>
			{/if}
		</div>
	{/if}

	<Field label="Do you use any mobility aids (wheelchair, walker, stick)?"><RadioGroup label="Do you use any mobility aids (wheelchair, walker, stick)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="mobilityAids" value={opt.value} bind:group={f.mobilityAids}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Has your ability to exercise declined recently?"><RadioGroup label="Has your ability to exercise declined recently?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="recentDecline" value={opt.value} bind:group={f.recentDecline}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<p class="hint">Sensory and balance</p>
	<Field label="Do you have any problems with your hearing?"><RadioGroup label="Do you have any problems with your hearing?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hearing" value={opt.value} bind:group={f.hearingProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have any problems with your eyesight?"><RadioGroup label="Do you have any problems with your eyesight?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="vision" value={opt.value} bind:group={f.visionProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have any balance issues?"><RadioGroup label="Do you have any balance issues?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="balance" value={opt.value} bind:group={f.balanceIssues}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
