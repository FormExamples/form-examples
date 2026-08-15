<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.symptomFrequency;

	const activityLimit = [
		{ value: 'not-at-all', label: 'Not at all' },
		{ value: 'a-little', label: 'A little of the time' },
		{ value: 'somewhat', label: 'Some of the time' },
		{ value: 'a-lot', label: 'Most of the time' },
		{ value: 'extremely', label: 'All of the time' }
	];

	const daytime = [
		{ value: 'not-at-all', label: 'Not at all' },
		{ value: 'once-or-twice', label: 'Once or twice a week' },
		{ value: 'three-to-six', label: '3 to 6 times a week' },
		{ value: 'once-a-day', label: 'Once a day' },
		{ value: 'more-than-once-a-day', label: 'More than once a day' }
	];

	const nighttime = [
		{ value: 'not-at-all', label: 'Not at all' },
		{ value: 'once-or-twice', label: 'Once or twice' },
		{ value: 'once-a-week', label: 'Once a week' },
		{ value: 'two-to-three-nights', label: '2 to 3 nights a week' },
		{ value: 'four-or-more-nights', label: '4 or more nights a week' }
	];

	const rescue = [
		{ value: 'not-at-all', label: 'Not at all' },
		{ value: 'once-or-twice', label: 'Once a week or less' },
		{ value: 'three-to-six', label: '2 or 3 times a week' },
		{ value: 'once-a-day', label: '1 or 2 times a day' },
		{ value: 'two-or-more-times-a-day', label: '3 or more times a day' }
	];

	const control = [
		{ value: 'completely-controlled', label: 'Completely controlled' },
		{ value: 'well-controlled', label: 'Well controlled' },
		{ value: 'somewhat-controlled', label: 'Somewhat controlled' },
		{ value: 'poorly-controlled', label: 'Poorly controlled' },
		{ value: 'not-controlled-at-all', label: 'Not controlled at all' }
	];
</script>

<Fieldset legend="Symptom Frequency">
	<p class="hint">Asthma Control Test (ACT) questions — think about the past 4 weeks.</p>

	<Field label="How much of the time did your asthma keep you from getting as much done at work, school, or at home?">
		<RadioGroup label="Activity limitation">
			{#each activityLimit as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="activityLimitation" value={opt.value} bind:group={s.activityLimitation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How often have you had shortness of breath?">
		<RadioGroup label="Shortness of breath">
			{#each daytime as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="daytimeSymptoms" value={opt.value} bind:group={s.daytimeSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How often did your asthma symptoms wake you up at night or earlier than usual in the morning?">
		<RadioGroup label="Night-time awakening">
			{#each nighttime as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nighttimeAwakening" value={opt.value} bind:group={s.nighttimeAwakening} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How often have you used your rescue inhaler or nebuliser medication?">
		<RadioGroup label="Rescue inhaler use">
			{#each rescue as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rescueInhalerUse" value={opt.value} bind:group={s.rescueInhalerUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How would you rate your asthma control during the past 4 weeks?">
		<RadioGroup label="Self-rated control">
			{#each control as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfRatedControl" value={opt.value} bind:group={s.selfRatedControl} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
