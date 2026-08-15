<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCentorGrade } from '#lib/engine/centor-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.exudate;
	const point = $derived(calculateCentorGrade(assessment.data).tonsillarExudatePoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 8 — Tonsillar exudate">
	<p class="hint">Criterion 1 — scores 1 point when tonsillar exudate or swelling is present.</p>

	<Field label="Tonsillar exudate or swelling present?">
		<RadioGroup label="Tonsillar exudate or swelling present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="exudate-tonsillarExudate"
						value={opt.value}
						bind:group={e.tonsillarExudate}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 1 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
