<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const p = assessment.data.fmsPatterns.trunkStabilityPushUp;
	const ct = assessment.data.fmsPatterns.clearingTests;

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

<Fieldset legend="Trunk Stability Push-Up">
	<p class="hint">
		Assesses trunk stability in the sagittal plane while a symmetrical upper-extremity motion is performed.
	</p>

	<Field label="Score" required>
		<RadioGroup label="Trunk Stability Push-Up Score">
			{#each scoreOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="trunkPushUpScore"
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

	<Alert type="warning" heading="Trunk Clearing Tests">
		<p>
			Spinal extension and flexion clearing tests. Positive if pain is produced during either movement.
		</p>
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={ct.trunkExtensionClearingPain} />
			Pain during trunk extension (press-up) clearing test
		</label>
		<label>
			<input type="checkbox" class="checkbox-input" bind:checked={ct.trunkFlexionClearingPain} />
			Pain during trunk flexion (posterior rocking) clearing test
		</label>
	</Alert>

	<Field label="Observations / Notes" inputId="trunkPushUpNotes">
		<TextAreaInput
			id="trunkPushUpNotes"
			label="Observations / Notes"
			rows={3}
			placeholder="Note any compensations, deviations, or relevant observations..."
			bind:value={p.asymmetryNotes}
		/>
	</Field>
</Fieldset>
