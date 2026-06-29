<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.sleepWakeCycle;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const flags: { key: 'difficultyFallingAsleep' | 'nighttimeWandering' | 'earlyMorningWaking' | 'daytimeNapping' | 'reversedSleepCycle'; label: string }[] = [
		{ key: 'difficultyFallingAsleep', label: 'Difficulty falling asleep?' },
		{ key: 'nighttimeWandering', label: 'Nighttime wandering?' },
		{ key: 'earlyMorningWaking', label: 'Early-morning waking?' },
		{ key: 'daytimeNapping', label: 'Excessive daytime napping?' },
		{ key: 'reversedSleepCycle', label: 'Reversed (day-night) sleep cycle?' }
	];
</script>

<Fieldset legend="Sleep-Wake Cycle">
	<p class="hint">Circadian rhythm and night-time behaviour.</p>

	<div class="field-grid field-grid-3">
		<Field label="Usual bedtime (24h hour)" inputId="bedtimeHourClock">
			<NumberInput id="bedtimeHourClock" label="Bedtime hour" min={0} max={23} bind:value={s.bedtimeHourClock} />
		</Field>
		<Field label="Average hours of sleep" inputId="averageHoursOfSleep">
			<NumberInput id="averageHoursOfSleep" label="Average hours of sleep" min={0} max={24} step={0.5} bind:value={s.averageHoursOfSleep} />
		</Field>
		<Field label="Night awakenings (count)" inputId="nightAwakeningCount">
			<NumberInput id="nightAwakeningCount" label="Night awakenings" min={0} max={50} bind:value={s.nightAwakeningCount} />
		</Field>
	</div>

	<div class="field-grid">
		{#each flags as flag (flag.key)}
			<Field label={flag.label}>
				<RadioGroup label={flag.label}>
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={flag.key} value={opt.value} bind:group={s[flag.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	<Field label="Sleep notes" inputId="sleepNotes">
		<TextAreaInput id="sleepNotes" label="Sleep notes" rows={3} bind:value={s.sleepNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1.5rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
