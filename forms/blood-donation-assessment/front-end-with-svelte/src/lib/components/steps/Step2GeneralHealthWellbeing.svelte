<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.generalHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="General Health & Wellbeing">
	<p class="hint">Same-day wellbeing checks before donation.</p>

	<Field label="Are you feeling well today?">
		<RadioGroup label="Are you feeling well today?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="feelingWellToday" value={opt.value} bind:group={g.feelingWellToday} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Did you get adequate sleep last night?">
		<RadioGroup label="Did you get adequate sleep last night?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adequateSleep" value={opt.value} bind:group={g.adequateSleep} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you eaten and drunk fluids in the last few hours?">
		<RadioGroup label="Have you eaten and drunk fluids in the last few hours?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adequateMealAndFluids" value={opt.value} bind:group={g.adequateMealAndFluids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you feeling faint, lightheaded, or unwell right now?">
		<RadioGroup label="Are you feeling faint, lightheaded, or unwell right now?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="feelingFaintOrUnwell" value={opt.value} bind:group={g.feelingFaintOrUnwell} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
