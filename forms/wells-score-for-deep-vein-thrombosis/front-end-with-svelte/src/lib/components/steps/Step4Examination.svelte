<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateWellsGrade } from '#lib/engine/wells-dvt-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.examination;
	const grade = $derived(calculateWellsGrade(assessment.data));
	const stepPoints = $derived(
		grade.criterionPoints['localised-tenderness'] +
			grade.criterionPoints['entire-leg-swollen'] +
			grade.criterionPoints['calf-swelling-over-3cm'] +
			grade.criterionPoints['pitting-oedema'] +
			grade.criterionPoints['collateral-superficial-veins']
	);
</script>

<Fieldset legend="Step 4 of 6 — Leg examination">
	<p class="hint">Criteria 4 to 8 — each scores +1 point when present.</p>

	<Field label="Criterion 4 — Localised tenderness along the distribution of the deep venous system">
		<RadioGroup label="Localised deep-vein tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-localisedTenderness"
					value="yes"
					bind:group={e.localisedTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-localisedTenderness"
					value="no"
					bind:group={e.localisedTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 5 — Entire leg swollen">
		<RadioGroup label="Entire leg swollen">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-entireLegSwollen"
					value="yes"
					bind:group={e.entireLegSwollen}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-entireLegSwollen"
					value="no"
					bind:group={e.entireLegSwollen}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 6 — Calf swelling >= 3 cm larger than the asymptomatic side (10 cm below the tibial tuberosity)">
		<RadioGroup label="Calf swelling over 3 cm">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-calfSwellingOver3cm"
					value="yes"
					bind:group={e.calfSwellingOver3cm}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-calfSwellingOver3cm"
					value="no"
					bind:group={e.calfSwellingOver3cm}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 7 — Pitting oedema confined to the symptomatic leg">
		<RadioGroup label="Pitting oedema">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-pittingOedema"
					value="yes"
					bind:group={e.pittingOedema}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-pittingOedema"
					value="no"
					bind:group={e.pittingOedema}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 8 — Collateral superficial veins (non-varicose)">
		<RadioGroup label="Collateral superficial veins">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-collateralSuperficialVeins"
					value="yes"
					bind:group={e.collateralSuperficialVeins}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="examination-collateralSuperficialVeins"
					value="no"
					bind:group={e.collateralSuperficialVeins}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Points from this step">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(stepPoints)}">
			+{stepPoints}
		</span>
	</Field>
</Fieldset>
