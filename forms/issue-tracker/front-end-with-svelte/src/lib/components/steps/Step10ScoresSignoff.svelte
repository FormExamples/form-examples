<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.scores;
</script>

<Fieldset legend="Scores & Sign-off">
	<p class="hint">
		Grade the issue on seven independent scales. The engine takes the worst single band
		(max-grade) to set the composite priority, and raises safety flags on extreme values.
	</p>

	<div class="field-grid">
		<Field label="Priority rank" inputId="scoreByPriorityRank" description="1 = do first; lower is more urgent.">
			<NumberInput id="scoreByPriorityRank" label="Priority rank" min={1} max={999} bind:value={s.scoreByPriorityRank} />
		</Field>
		<Field label="Severity of impact (1-5)" inputId="scoreBySeverityOfImpact">
			<Select
				id="scoreBySeverityOfImpact"
				label="Severity of impact"
				bind:value={
					() => (s.scoreBySeverityOfImpact === null ? '' : String(s.scoreBySeverityOfImpact)),
					(v) => (s.scoreBySeverityOfImpact = v === '' ? null : (Number(v) as 1 | 2 | 3 | 4 | 5))
				}
			>
				<option value="">-- Select --</option>
				<option value="1">1 — Minimal impact</option>
				<option value="2">2 — Minor impact</option>
				<option value="3">3 — Moderate impact</option>
				<option value="4">4 — Major impact</option>
				<option value="5">5 — Catastrophic impact</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Magnitude of damage (1-10)" inputId="scoreByMagnitudeOfDamage" description="Richter-style 1-10 scale.">
			<NumberInput id="scoreByMagnitudeOfDamage" label="Magnitude of damage" min={1} max={10} bind:value={s.scoreByMagnitudeOfDamage} />
		</Field>
		<Field label="Harm grade (0-4)" inputId="scoreByHarmGrade" description="NHS LFPSE harm grade.">
			<Select
				id="scoreByHarmGrade"
				label="Harm grade"
				bind:value={
					() => (s.scoreByHarmGrade === null ? '' : String(s.scoreByHarmGrade)),
					(v) => (s.scoreByHarmGrade = v === '' ? null : (Number(v) as 0 | 1 | 2 | 3 | 4))
				}
			>
				<option value="">-- Select --</option>
				<option value="0">0 — No harm</option>
				<option value="1">1 — Low harm</option>
				<option value="2">2 — Moderate harm</option>
				<option value="3">3 — Severe harm</option>
				<option value="4">4 — Fatal</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Failure condition" inputId="scoreByFailureCondition" description="FAA / EASA failure condition.">
			<Select id="scoreByFailureCondition" label="Failure condition" bind:value={s.scoreByFailureCondition}>
				<option value="">-- Select --</option>
				<option value="A">A — Catastrophic</option>
				<option value="B">B — Hazardous</option>
				<option value="C">C — Major</option>
				<option value="D">D — Minor</option>
				<option value="E">E — No effect</option>
			</Select>
		</Field>
		<Field label="MoSCoW requirement" inputId="scoreByMoscowRequirement">
			<Select
				id="scoreByMoscowRequirement"
				label="MoSCoW requirement"
				bind:value={
					() => (s.scoreByMoscowRequirement === null ? '' : String(s.scoreByMoscowRequirement)),
					(v) => (s.scoreByMoscowRequirement = v === '' ? null : (Number(v) as 1 | 2 | 3 | 4))
				}
			>
				<option value="">-- Select --</option>
				<option value="1">1 — Must have</option>
				<option value="2">2 — Should have</option>
				<option value="3">3 — Could have</option>
				<option value="4">4 — Won't have</option>
			</Select>
		</Field>
	</div>

	<Field label="Frequency of occurrence (%)" inputId="scoreByFrequencyPercent" description="Percentage of usage affected (0-100).">
		<NumberInput id="scoreByFrequencyPercent" label="Frequency of occurrence" min={0} max={100} step="0.1" bind:value={s.scoreByFrequencyPercent} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
