<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWellsGrade } from '$lib/engine/wells-pe-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.criteria;
	const grade = $derived(calculateWellsGrade(assessment.data));
	const stepPoints = $derived(
		grade.criterionPoints['dvt-signs'] +
			grade.criterionPoints['pe-most-likely'] +
			grade.criterionPoints['immobilisation-surgery'] +
			grade.criterionPoints['previous-dvt-pe'] +
			grade.criterionPoints['haemoptysis'] +
			grade.criterionPoints['malignancy']
	);
</script>

<Fieldset legend="Step 4 of 6 — Clinical criteria">
	<p class="hint">
		Six weighted criteria. Heart rate &gt; 100 (criterion 3) is captured from a measured value on the
		next step.
	</p>

	<Field label="Criterion 1 — Clinical signs and symptoms of DVT (leg swelling and pain on palpation of the deep veins) (+3)">
		<RadioGroup label="Clinical signs of DVT">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-dvtSigns"
					value="yes"
					bind:group={c.dvtSigns}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-dvtSigns"
					value="no"
					bind:group={c.dvtSigns}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 — PE is the number-one diagnosis, or equally likely (+3)">
		<RadioGroup label="PE most likely">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-peMostLikely"
					value="yes"
					bind:group={c.peMostLikely}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-peMostLikely"
					value="no"
					bind:group={c.peMostLikely}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 4 — Immobilisation for at least 3 days, or surgery in the previous 4 weeks (+1.5)">
		<RadioGroup label="Immobilisation or recent surgery">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-immobilisationSurgery"
					value="yes"
					bind:group={c.immobilisationSurgery}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-immobilisationSurgery"
					value="no"
					bind:group={c.immobilisationSurgery}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 5 — Previous, objectively diagnosed DVT or PE (+1.5)">
		<RadioGroup label="Previous DVT or PE">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-previousDvtPe"
					value="yes"
					bind:group={c.previousDvtPe}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-previousDvtPe"
					value="no"
					bind:group={c.previousDvtPe}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 6 — Haemoptysis (+1)">
		<RadioGroup label="Haemoptysis">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-haemoptysis"
					value="yes"
					bind:group={c.haemoptysis}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-haemoptysis"
					value="no"
					bind:group={c.haemoptysis}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 7 — Malignancy on treatment, treated within the last 6 months, or palliative (+1)">
		<RadioGroup label="Malignancy">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-malignancy"
					value="yes"
					bind:group={c.malignancy}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="criteria-malignancy"
					value="no"
					bind:group={c.malignancy}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Points from this step (excludes heart rate)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(stepPoints)}">
			+{stepPoints}
		</span>
	</Field>
</Fieldset>
