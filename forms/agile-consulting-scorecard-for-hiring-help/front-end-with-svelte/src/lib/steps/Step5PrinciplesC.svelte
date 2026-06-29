<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold text-base-content">Step 5 — Principles 9–12</h2>

	<ChecklistItem
		bind:item={assessment.data.principles.p9}
		name="p9"
		heading="Principle 9 — Technical excellence and good design"
		prompt="Quality-attribute metrics are wired into pre-commit hooks and continuous integration."
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p10}
		name="p10"
		heading="Principle 10 — Simplicity"
		prompt={"Every product team has \u2265 2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC)."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p11}
		name="p11"
		heading="Principle 11 — Self-organizing teams"
		prompt={"A 5-point Likert \u201cour team is self-organizing\u201d averages \u201cAgree\u201d or better."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p12}
		name="p12"
		heading="Principle 12 — Reflection at regular intervals"
		prompt="Every leader has shared their previous 2 retrospectives with all stakeholders."
	/>
</section>
