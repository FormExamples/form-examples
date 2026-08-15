<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		linguisticTotal,
		communicationTotal,
		rawToScore,
		scoreToGrade,
		gradeLabel,
		gradeColor,
		COMMUNICATION_MAX
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.clinicalCommunication;
	const bands = [0, 1, 2, 3];

	const commTotal = $derived(communicationTotal(d));
	const score = $derived(
		rawToScore(linguisticTotal(assessment.data.linguisticCriteria) + commTotal)
	);
	const grade = $derived(scoreToGrade(score));
</script>

<Fieldset legend="Clinical communication indicators">
	<p class="hint">
		Rate each clinical-communication criterion on the 0-3 band scale. Band 2 is the competent
		threshold; band 3 indicates adept, patient-centred communication.
	</p>

	<Field label="Relationship-building" description="Initiating, building rapport and demonstrating empathy">
		<RadioGroup label="Relationship-building band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" id={n === 0 ? 'relationshipBuilding' : undefined} name="relationshipBuilding" value={n} bind:group={d.relationshipBuilding} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Understanding the patient's perspective" description="Eliciting and responding to concerns and expectations">
		<RadioGroup label="Understanding patient perspective band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="understandingPatientPerspective" value={n} bind:group={d.understandingPatientPerspective} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Providing structure" description="Sequencing, signposting and managing the consultation">
		<RadioGroup label="Providing structure band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="providingStructure" value={n} bind:group={d.providingStructure} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Information-gathering" description="Open and closed questioning, clarification">
		<RadioGroup label="Information-gathering band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="informationGathering" value={n} bind:group={d.informationGathering} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Information-giving" description="Clear explanation and checking patient understanding">
		<RadioGroup label="Information-giving band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="informationGiving" value={n} bind:group={d.informationGiving} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Examiner comments" inputId="examinerComments">
		<TextAreaInput id="examinerComments" label="Examiner comments" rows={3} bind:value={d.examinerComments} />
	</Field>

	<p class="subtotal">Communication subtotal: <strong>{commTotal} / {COMMUNICATION_MAX}</strong></p>
</Fieldset>

<div class="grade-preview rounded-xl border-2 p-4 text-center {gradeColor(grade)}">
	<div class="text-sm font-medium opacity-80">Provisional result (updates as you rate)</div>
	<div class="mt-1 text-2xl font-bold">{score} / 500 — {gradeLabel(grade)}</div>
</div>

<style>
	.subtotal {
		margin-top: 1rem;
		font-size: 0.95rem;
	}
	.grade-preview {
		margin-top: 1.5rem;
	}
</style>
