<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.behaviour;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const items = [
		{
			key: 'actualAttempt' as const,
			name: 'behaviour-actualAttempt',
			label: 'Actual attempt',
			help: 'A potentially self-injurious act with at least some intent to die. Counts as suicidal behaviour.'
		},
		{
			key: 'interruptedAttempt' as const,
			name: 'behaviour-interruptedAttempt',
			label: 'Interrupted attempt',
			help: 'Interrupted by an outside circumstance before self-harm begins. Counts as suicidal behaviour.'
		},
		{
			key: 'abortedAttempt' as const,
			name: 'behaviour-abortedAttempt',
			label: 'Aborted / self-interrupted attempt',
			help: 'The person stops themselves before beginning the act. Counts as suicidal behaviour.'
		},
		{
			key: 'preparatoryActs' as const,
			name: 'behaviour-preparatoryActs',
			label: 'Preparatory acts or behaviour',
			help: 'Steps taken to prepare, e.g. acquiring means or writing a note. Counts as suicidal behaviour.'
		},
		{
			key: 'nonSuicidalSelfInjury' as const,
			name: 'behaviour-nonSuicidalSelfInjury',
			label: 'Non-suicidal self-injury (NSSI)',
			help: 'Self-injury without intent to die. Tracked separately — does NOT count as suicidal behaviour.'
		}
	];
</script>

<Fieldset legend="Step 5 of 8 — Suicidal behaviour">
	<p class="hint">
		Record each category as present or absent, plus the recency window and the lifetime attempt
		count.
	</p>

	{#each items as item (item.key)}
		<Field label={item.label} description={item.help}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={item.name}
							value={opt.value}
							bind:group={b[item.key]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field
		label="Recency of most recent suicidal behaviour"
		description="Recency drives the risk tier: behaviour within the past 3 months is High risk."
		inputId="behaviour-behaviourRecency"
	>
		<Select
			id="behaviour-behaviourRecency"
			label="Recency of most recent suicidal behaviour"
			bind:value={b.behaviourRecency}
		>
			<option value="">— Select —</option>
			<option value="within-3-months">Within the past 3 months</option>
			<option value="over-3-months">More than 3 months ago / lifetime</option>
		</Select>
	</Field>

	<Field label="Lifetime actual-attempt count" inputId="behaviour-lifetimeAttemptCount">
		<NumberInput
			id="behaviour-lifetimeAttemptCount"
			label="Lifetime actual-attempt count"
			min={0}
			step={1}
			bind:value={b.lifetimeAttemptCount}
		/>
	</Field>

	<Field label="Most recent actual-attempt date" inputId="behaviour-mostRecentAttemptDate">
		<DateInput
			id="behaviour-mostRecentAttemptDate"
			label="Most recent actual-attempt date"
			bind:value={b.mostRecentAttemptDate}
		/>
	</Field>
</Fieldset>
