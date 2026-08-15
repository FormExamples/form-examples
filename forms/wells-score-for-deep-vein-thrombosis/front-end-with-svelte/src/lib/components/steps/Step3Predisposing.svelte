<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateWellsGrade } from '#lib/engine/wells-dvt-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.predisposing;
	const grade = $derived(calculateWellsGrade(assessment.data));
</script>

<Fieldset legend="Step 3 of 6 — Predisposing factors">
	<p class="hint">
		Criteria 1, 2, 3, and 9 — each scores +1 point when present.
	</p>

	<Field label="Criterion 1 — Active cancer (treatment ongoing, within 6 months, or palliative)">
		<RadioGroup label="Active cancer">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-activeCancer"
					value="yes"
					bind:group={p.activeCancer}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-activeCancer"
					value="no"
					bind:group={p.activeCancer}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 — Paralysis, paresis, or recent plaster immobilisation of the lower extremities">
		<RadioGroup label="Paralysis or immobilisation">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-paralysisOrImmobilisation"
					value="yes"
					bind:group={p.paralysisOrImmobilisation}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-paralysisOrImmobilisation"
					value="no"
					bind:group={p.paralysisOrImmobilisation}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 3 — Recently bedridden >= 3 days, or major surgery within 12 weeks requiring general or regional anaesthesia">
		<RadioGroup label="Recently bedridden or major surgery">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-recentlyBedriddenOrSurgery"
					value="yes"
					bind:group={p.recentlyBedriddenOrSurgery}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-recentlyBedriddenOrSurgery"
					value="no"
					bind:group={p.recentlyBedriddenOrSurgery}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 9 — Previously documented DVT">
		<RadioGroup label="Previously documented DVT">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-previouslyDocumentedDvt"
					value="yes"
					bind:group={p.previouslyDocumentedDvt}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="predisposing-previouslyDocumentedDvt"
					value="no"
					bind:group={p.previouslyDocumentedDvt}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Points from this step">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
			grade.criterionPoints['active-cancer'] +
				grade.criterionPoints['paralysis-or-immobilisation'] +
				grade.criterionPoints['recently-bedridden-or-surgery'] +
				grade.criterionPoints['previously-documented-dvt']
		)}">
			+{grade.criterionPoints['active-cancer'] +
				grade.criterionPoints['paralysis-or-immobilisation'] +
				grade.criterionPoints['recently-bedridden-or-surgery'] +
				grade.criterionPoints['previously-documented-dvt']}
		</span>
	</Field>
</Fieldset>
