<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateOttawaDecision } from '#lib/engine/ottawa-ankle-grader.js';
	import { decisionLabel, decisionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	const t = assessment.data.ankleTenderness;
	const decision = $derived(calculateOttawaDecision(assessment.data));
	const gate = $derived(
		assessment.data.painZones.malleolarZonePain === 'yes'
			? 'malleolar-zone pain present'
			: 'no malleolar-zone pain (precondition not met)'
	);
</script>

<Fieldset legend="Step 5 of 8 — Ankle bone tenderness">
	<p class="hint">
		Ankle criteria A1 and A2. Either one, together with malleolar-zone pain, indicates an ankle
		X-ray.
	</p>

	<Field label="A1 — Bone tenderness at the posterior edge or tip of the lateral malleolus (distal 6 cm of the fibula)?">
		<RadioGroup label="Lateral malleolus tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="ankleTenderness-lateralMalleolusTenderness"
					value="yes"
					bind:group={t.lateralMalleolusTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="ankleTenderness-lateralMalleolusTenderness"
					value="no"
					bind:group={t.lateralMalleolusTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="A2 — Bone tenderness at the posterior edge or tip of the medial malleolus (distal 6 cm of the tibia)?">
		<RadioGroup label="Medial malleolus tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="ankleTenderness-medialMalleolusTenderness"
					value="yes"
					bind:group={t.medialMalleolusTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="ankleTenderness-medialMalleolusTenderness"
					value="no"
					bind:group={t.medialMalleolusTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Live ankle X-ray decision">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge label={decisionLabel(decision.ankleXrayIndicated)} colorClass={decisionColor(decision.ankleXrayIndicated)} />
			<span class="text-sm text-base-content/60">({gate})</span>
		</span>
	</Field>
</Fieldset>
