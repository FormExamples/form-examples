<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGraceGrade } from '$lib/engine/grace-grader';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const hf = assessment.data.heartFailure;
	const grade = $derived(calculateGraceGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 7 — Heart-failure severity">
	<p class="hint">Killip class (variable 5) — each higher class adds a large point increment.</p>

	<Field label="Killip class" required inputId="heartFailure-killipClass">
		<Select id="heartFailure-killipClass" label="Killip class" required bind:value={hf.killipClass}>
			<option value="">— Select —</option>
			<option value="I">Class I — no heart failure</option>
			<option value="II">Class II — rales / raised JVP</option>
			<option value="III">Class III — pulmonary oedema</option>
			<option value="IV">Class IV — cardiogenic shock</option>
		</Select>
	</Field>

	<Field label="Killip points">
		<span class="inline-block rounded-full border border-base-300 bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
			{grade.killipPoints} points
		</span>
	</Field>
</Fieldset>
