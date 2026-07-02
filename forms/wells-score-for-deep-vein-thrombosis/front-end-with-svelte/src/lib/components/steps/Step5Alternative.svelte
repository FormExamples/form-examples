<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWellsGrade } from '$lib/engine/wells-dvt-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.alternative;
	const point = $derived(
		calculateWellsGrade(assessment.data).criterionPoints['alternative-diagnosis-as-likely']
	);
</script>

<Fieldset legend="Step 5 of 6 — Alternative diagnosis">
	<p class="hint">
		The single downward adjustment — subtracts 2 points when an alternative diagnosis (e.g. cellulitis,
		ruptured Baker cyst, superficial thrombophlebitis) is at least as likely as DVT.
	</p>

	<Field label="Is an alternative diagnosis at least as likely as DVT?">
		<RadioGroup label="Alternative diagnosis at least as likely">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="alternative-alternativeDiagnosisAsLikely"
					value="yes"
					bind:group={a.alternativeDiagnosisAsLikely}
				/> Yes (subtract 2)
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="alternative-alternativeDiagnosisAsLikely"
					value="no"
					bind:group={a.alternativeDiagnosisAsLikely}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Adjustment from this step">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} points
		</span>
	</Field>
</Fieldset>
