<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.fmsPatterns.deepSquat;

	function setScore(s: 0 | 1 | 2 | 3) {
		p.score = s;
	}

	const scoreOptions = [
		{ value: 0, label: '0 - Pain during movement' },
		{ value: 1, label: '1 - Unable to perform pattern' },
		{ value: 2, label: '2 - Performs with compensation' },
		{ value: 3, label: '3 - Performs without compensation' }
	];
</script>

<Fieldset legend="Deep Squat">
	<p class="hint">
		Assesses bilateral, symmetrical, functional mobility of the hips, knees, and ankles.
		Dowel held overhead assesses shoulder and thoracic spine mobility.
	</p>

	<Field label="Score" required>
		<RadioGroup label="Deep Squat Score">
			{#each scoreOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="deepSquatScore"
						value={opt.value}
						checked={p.score === opt.value}
						onchange={() => setScore(opt.value as 0 | 1 | 2 | 3)}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Pain reported during this movement">
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={p.painDuringMovement} />
			Pain reported during this movement
		</label>
	</Field>

	<Field label="Observations / Notes" inputId="deepSquatNotes">
		<TextAreaInput
			id="deepSquatNotes"
			label="Observations / Notes"
			rows={3}
			placeholder="Note any compensations, deviations, or relevant observations..."
			bind:value={p.asymmetryNotes}
		/>
	</Field>
</Fieldset>
