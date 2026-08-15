<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateOttawaDecision } from '#lib/engine/ottawa-ankle-grader.js';
	import { decisionLabel, decisionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	const t = assessment.data.footTenderness;
	const decision = $derived(calculateOttawaDecision(assessment.data));
	const gate = $derived(
		assessment.data.painZones.midfootZonePain === 'yes'
			? 'midfoot-zone pain present'
			: 'no midfoot-zone pain (precondition not met)'
	);
</script>

<Fieldset legend="Step 6 of 8 — Foot bone tenderness">
	<p class="hint">
		Foot criteria F1 and F2. Either one, together with midfoot-zone pain, indicates a foot X-ray.
	</p>

	<Field label="F1 — Bone tenderness at the base of the fifth metatarsal?">
		<RadioGroup label="Fifth-metatarsal-base tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="footTenderness-fifthMetatarsalBaseTenderness"
					value="yes"
					bind:group={t.fifthMetatarsalBaseTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="footTenderness-fifthMetatarsalBaseTenderness"
					value="no"
					bind:group={t.fifthMetatarsalBaseTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="F2 — Bone tenderness at the navicular?">
		<RadioGroup label="Navicular tenderness">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="footTenderness-navicularTenderness"
					value="yes"
					bind:group={t.navicularTenderness}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="footTenderness-navicularTenderness"
					value="no"
					bind:group={t.navicularTenderness}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Live foot X-ray decision">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge label={decisionLabel(decision.footXrayIndicated)} colorClass={decisionColor(decision.footXrayIndicated)} />
			<span class="text-sm text-base-content/60">({gate})</span>
		</span>
	</Field>
</Fieldset>
