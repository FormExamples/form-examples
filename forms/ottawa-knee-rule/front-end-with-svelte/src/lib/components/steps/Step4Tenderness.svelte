<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOttawaKnee } from '#lib/engine/ottawa-knee-grader.js';
	import { criterionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.tenderness;
	const grade = $derived(gradeOttawaKnee(assessment.data));
</script>

<Fieldset legend="Step 4 of 7 — Bony tenderness">
	<p class="hint">
		Criteria 2 and 3. Patellar tenderness indicates imaging only when it is isolated — that is, with
		no other bony tenderness of the knee.
	</p>

	<Field label="Tenderness at the patella">
		<RadioGroup label="Patellar tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-patellarTenderness"
					value="yes"
					bind:group={t.patellarTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-patellarTenderness"
					value="no"
					bind:group={t.patellarTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Other bony tenderness of the knee (used to test isolation of the patellar tenderness)">
		<RadioGroup label="Other bony tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-otherBonyTenderness"
					value="yes"
					bind:group={t.otherBonyTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-otherBonyTenderness"
					value="no"
					bind:group={t.otherBonyTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 — isolated patellar tenderness (patellar tenderness with no other bony tenderness)">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionColor(
				grade.isolatedPatellarCriterion
			)}"
		>
			{grade.isolatedPatellarCriterion ? 'Present — X-ray indicated' : 'Absent'}
		</span>
	</Field>

	<Field label="Criterion 3 — tenderness at the head of the fibula">
		<RadioGroup label="Fibular head tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-fibularHeadTenderness"
					value="yes"
					bind:group={t.fibularHeadTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="tenderness-fibularHeadTenderness"
					value="no"
					bind:group={t.fibularHeadTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
