<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold text-slate-800">Step 4 — Principles 5–8</h2>

	<ChecklistItem
		bind:item={assessment.data.principles.p5}
		name="p5"
		heading="Principle 5 — Motivated individuals"
		prompt={"A \u201c3-amigos\u201d team (business + dev + test) has shipped a real new MVP within 30 days and on budget."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p6}
		name="p6"
		heading="Principle 6 — Face-to-face conversation"
		prompt={"Every product owner has committed to \u2265 50% face-to-face time (or weekly-video equivalent for remote teams)."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p7}
		name="p7"
		heading="Principle 7 — Working software is the primary measure"
		prompt={"A new \u201cfizz buzz\u201d program has been created and shipped to production."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p8}
		name="p8"
		heading="Principle 8 — Sustainable pace"
		prompt={"All staff have a sustaining budget for \u2265 1 year secured."}
	/>
</section>
