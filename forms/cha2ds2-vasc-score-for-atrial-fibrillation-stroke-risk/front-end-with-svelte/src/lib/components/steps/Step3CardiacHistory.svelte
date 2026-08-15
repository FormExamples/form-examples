<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCha2ds2VascGrade } from '#lib/engine/cha2ds2vasc-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.cardiac;
	const grade = $derived(calculateCha2ds2VascGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 6 — Cardiac history">
	<p class="hint">
		Criteria C, H, and V — congestive heart failure, hypertension, and vascular disease. Each scores
		1 point when present.
	</p>

	<Field
		label="Congestive heart failure or LV dysfunction? (C)"
		description="Signs, symptoms, or objective LV systolic dysfunction. Scores 1 point when yes."
	>
		<RadioGroup label="Congestive heart failure or LV dysfunction?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiac-congestiveHeartFailure"
						value={opt.value}
						bind:group={c.congestiveHeartFailure}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion C point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.congestiveHeartFailurePoint)}">
			{grade.congestiveHeartFailurePoint} point
		</span>
	</Field>

	<Field
		label="Hypertension? (H)"
		description="History of hypertension, on treatment, or resting BP > 140/90 on >= 2 occasions. Scores 1 point when yes."
	>
		<RadioGroup label="Hypertension?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiac-hypertension"
						value={opt.value}
						bind:group={c.hypertension}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion H point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.hypertensionPoint)}">
			{grade.hypertensionPoint} point
		</span>
	</Field>

	<Field
		label="Vascular disease? (V)"
		description="Prior myocardial infarction, peripheral artery disease, or aortic plaque. Scores 1 point when yes."
	>
		<RadioGroup label="Vascular disease?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiac-vascularDisease"
						value={opt.value}
						bind:group={c.vascularDisease}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion V point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.vascularDiseasePoint)}">
			{grade.vascularDiseasePoint} point
		</span>
	</Field>
</Fieldset>
