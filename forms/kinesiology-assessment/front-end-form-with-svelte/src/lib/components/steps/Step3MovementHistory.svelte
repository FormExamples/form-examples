<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.movementHistory;

	const activityOptions = [
		{ value: 'sedentary', label: 'Sedentary' },
		{ value: 'light', label: 'Light' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'vigorous', label: 'Vigorous' },
		{ value: 'elite', label: 'Elite' }
	];
	const painOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Movement History">
	<p class="hint">Previous injuries, activity level, and current pain status.</p>

	<Field label="Injury History" inputId="injuryHistory">
		<TextAreaInput
			id="injuryHistory"
			label="Injury History"
			rows={3}
			placeholder="Describe any previous musculoskeletal injuries, surgeries, or chronic conditions..."
			bind:value={m.injuryHistory}
		/>
	</Field>

	<Field label="Current Activity Level" required>
		<RadioGroup label="Current Activity Level">
			{#each activityOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="activityLevel"
						value={opt.value}
						bind:group={m.activityLevel}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Sport/Exercise Participation" inputId="sportParticipation">
		<TextAreaInput
			id="sportParticipation"
			label="Sport/Exercise Participation"
			rows={3}
			placeholder="Describe current sport/exercise participation, frequency, and duration..."
			bind:value={m.sportParticipation}
		/>
	</Field>

	<Field label="Current Pain Level" required>
		<RadioGroup label="Current Pain Level">
			{#each painOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="currentPain"
						value={opt.value}
						bind:group={m.currentPain}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Pain Details" inputId="currentPainDetails">
		<TextAreaInput
			id="currentPainDetails"
			label="Pain Details"
			rows={3}
			placeholder="If pain is present, describe location, nature, and aggravating/easing factors..."
			bind:value={m.currentPainDetails}
		/>
	</Field>

	<Field label="Previous Treatments" inputId="previousTreatments">
		<TextAreaInput
			id="previousTreatments"
			label="Previous Treatments"
			rows={3}
			placeholder="List any previous physiotherapy, chiropractic, or other treatments..."
			bind:value={m.previousTreatments}
		/>
	</Field>
</Fieldset>
