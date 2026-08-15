<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.applicability;
</script>

<Fieldset legend="Step 3 of 8 — Applicability">
	<p class="hint">
		Confirm the rule can be applied reliably before recording the bedside findings. If the
		assessment is unreliable (intoxication, distracting injury, or sensory deficit), the rule may be
		invalid — consider imaging on clinical judgement.
	</p>

	<Field label="Is the assessment reliable (no intoxication, distracting injury, or sensory deficit)?">
		<RadioGroup label="Assessment reliable">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="applicability-assessmentReliable"
					value="yes"
					bind:group={a.assessmentReliable}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="applicability-assessmentReliable"
					value="no"
					bind:group={a.assessmentReliable}
				/> No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
