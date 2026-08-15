<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.moodAffect;

	const moodOptions = [
		{ value: 'very-low', label: 'Very Low' },
		{ value: 'low', label: 'Low' },
		{ value: 'neutral', label: 'Neutral' },
		{ value: 'good', label: 'Good' },
		{ value: 'very-good', label: 'Very Good' }
	];
	const sleepOptions = [
		{ value: 'very-poor', label: 'Very Poor' },
		{ value: 'poor', label: 'Poor' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'good', label: 'Good' },
		{ value: 'very-good', label: 'Very Good' }
	];
	const appetiteOptions = [
		{ value: 'significant-decrease', label: 'Significant Decrease' },
		{ value: 'decrease', label: 'Decrease' },
		{ value: 'no-change', label: 'No Change' },
		{ value: 'increase', label: 'Increase' },
		{ value: 'significant-increase', label: 'Significant Increase' }
	];
	const energyOptions = [
		{ value: 'very-low', label: 'Very Low' },
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' },
		{ value: 'very-high', label: 'Very High' }
	];
	const concentrationOptions = [
		{ value: 'very-poor', label: 'Very Poor' },
		{ value: 'poor', label: 'Poor' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'good', label: 'Good' },
		{ value: 'excellent', label: 'Excellent' }
	];
</script>

<Fieldset legend="Mood and Affect">
	<p class="hint">How you have been feeling recently.</p>

	<Field label="How would you rate your current mood?">
		<RadioGroup label="Current mood">
			{#each moodOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="currentMood" value={opt.value} bind:group={m.currentMood} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How has your sleep quality been?">
		<RadioGroup label="Sleep quality">
			{#each sleepOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sleepQuality" value={opt.value} bind:group={m.sleepQuality} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you experienced any changes in appetite?">
		<RadioGroup label="Appetite changes">
			{#each appetiteOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="appetiteChanges" value={opt.value} bind:group={m.appetiteChanges} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How would you describe your energy level?">
		<RadioGroup label="Energy level">
			{#each energyOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="energyLevel" value={opt.value} bind:group={m.energyLevel} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How is your ability to concentrate?">
		<RadioGroup label="Concentration">
			{#each concentrationOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="concentration" value={opt.value} bind:group={m.concentration} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
