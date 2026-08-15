<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ChecklistField from '#lib/components/ChecklistField.svelte';
	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = $state(assessment.data);
</script>

<Fieldset legend="5. Principles 9–12">
	<ChecklistField
		bind:item={d.principles.p9}
		name="p9"
		heading="Principle 9 — Technical excellence and good design"
		prompt="Quality-attribute metrics are wired into pre-commit hooks and continuous integration."
	/>
	<ChecklistField
		bind:item={d.principles.p10}
		name="p10"
		heading="Principle 10 — Simplicity"
		prompt={"Every product team has ≥ 2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC)."}
	/>
	<ChecklistField
		bind:item={d.principles.p11}
		name="p11"
		heading="Principle 11 — Self-organizing teams"
		prompt={"A 5-point Likert “our team is self-organizing” averages “Agree” or better."}
	/>
	<ChecklistField
		bind:item={d.principles.p12}
		name="p12"
		heading="Principle 12 — Reflection at regular intervals"
		prompt="Every leader has shared their previous 2 retrospectives with all stakeholders."
	/>
</Fieldset>
