<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCssrsGrade } from '$lib/engine/cssrs-grader';
	import { riskTierLabel, riskTierColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.means;
	const grade = $derived(calculateCssrsGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 8 — Means and protective factors">
	<p class="hint">
		Access to lethal means is a modifiable, high-impact risk factor and always raises a flag. Record
		protective factors that mitigate risk.
	</p>

	<Field label="Access to lethal means" inputId="means-accessToLethalMeans">
		<Select
			id="means-accessToLethalMeans"
			label="Access to lethal means"
			bind:value={m.accessToLethalMeans}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Protective factors" inputId="means-protectiveFactors">
		<TextAreaInput
			id="means-protectiveFactors"
			label="Protective factors"
			rows={3}
			placeholder="e.g. reasons for living, social support, engagement with care."
			bind:value={m.protectiveFactors}
		/>
	</Field>

	<Field label="Live risk tier">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskTierColor(
				grade.riskTier
			)}"
		>
			{riskTierLabel(grade.riskTier)}
		</span>
	</Field>
</Fieldset>
