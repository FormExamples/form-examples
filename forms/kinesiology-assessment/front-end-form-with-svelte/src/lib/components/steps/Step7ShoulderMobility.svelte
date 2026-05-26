<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const p = assessment.data.fmsPatterns.shoulderMobility;
	const ct = assessment.data.fmsPatterns.clearingTests;

	const scoreOptions = [
		{ value: 0, label: '0 - Pain' },
		{ value: 1, label: '1 - Unable' },
		{ value: 2, label: '2 - With compensation' },
		{ value: 3, label: '3 - Without compensation' }
	];

	function setLeft(s: 0 | 1 | 2 | 3) { p.leftScore = s; }
	function setRight(s: 0 | 1 | 2 | 3) { p.rightScore = s; }
</script>

<Fieldset legend="Shoulder Mobility">
	<p class="hint">
		Assesses bilateral shoulder range of motion, combining internal rotation with adduction
		and external rotation with abduction.
	</p>

	<div class="field-grid">
		<Field label="Left Side Score" required>
			<RadioGroup label="Shoulder Mobility Left Side Score">
				{#each scoreOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="shoulderMobilityLeft"
							value={opt.value}
							checked={p.leftScore === opt.value}
							onchange={() => setLeft(opt.value as 0 | 1 | 2 | 3)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Right Side Score" required>
			<RadioGroup label="Shoulder Mobility Right Side Score">
				{#each scoreOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="shoulderMobilityRight"
							value={opt.value}
							checked={p.rightScore === opt.value}
							onchange={() => setRight(opt.value as 0 | 1 | 2 | 3)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="Pain reported during this movement">
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={p.painDuringMovement} />
			Pain reported during this movement
		</label>
	</Field>

	<Alert type="warning" heading="Shoulder Clearing Test">
		<p>
			Place hand on opposite shoulder and attempt to point elbow upward. Positive if pain is produced.
		</p>
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={ct.shoulderClearingPain} />
			Pain produced during shoulder clearing test
		</label>
	</Alert>

	<Field label="Asymmetry Notes / Observations" inputId="shoulderMobilityNotes">
		<TextAreaInput
			id="shoulderMobilityNotes"
			label="Asymmetry Notes"
			rows={3}
			placeholder="Note any left-right differences, compensations, or relevant observations..."
			bind:value={p.asymmetryNotes}
		/>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
