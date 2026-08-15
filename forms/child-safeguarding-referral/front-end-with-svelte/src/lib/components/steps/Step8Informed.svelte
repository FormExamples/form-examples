<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const i = assessment.data.informed;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 8 of 9 — Who else is informed">
	<p class="hint">
		Agencies already contacted, any strategy discussion, and prior safeguarding history.
	</p>

	<Field label="Agencies already contacted" inputId="informed-agenciesContacted">
		<TextAreaInput
			id="informed-agenciesContacted"
			label="Agencies already contacted"
			rows={3}
			placeholder="e.g. Police (101) informed on 30 June."
			bind:value={i.agenciesContacted}
		/>
	</Field>

	<Field label="Has a strategy discussion already been held?">
		<RadioGroup label="Has a strategy discussion already been held?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="informed-strategyDiscussionHeld"
						value={opt.value}
						bind:group={i.strategyDiscussionHeld}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Previous safeguarding history"
		description="Prior involvement raises a flag so the duty team can link records."
		inputId="informed-previousSafeguardingHistory"
	>
		<TextAreaInput
			id="informed-previousSafeguardingHistory"
			label="Previous safeguarding history"
			rows={3}
			placeholder="Any known prior safeguarding involvement."
			bind:value={i.previousSafeguardingHistory}
		/>
	</Field>
</Fieldset>
