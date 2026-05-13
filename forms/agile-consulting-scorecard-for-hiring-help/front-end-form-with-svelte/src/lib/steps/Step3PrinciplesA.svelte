<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold text-slate-800">Step 3 — Principles 1–4</h2>

	<ChecklistItem
		bind:item={assessment.data.principles.p1}
		name="p1"
		heading="Principle 1 — Customer satisfaction"
		prompt="Every product lead measures customer Net Promoter Score (NPS)."
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p2}
		name="p2"
		heading="Principle 2 — Welcome changing requirements"
		prompt={"The \u201chello world\u201d program has been internationalized to \u2265 1 additional language using the user locale."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p3}
		name="p3"
		heading="Principle 3 — Deliver working software frequently"
		prompt={"The internationalized \u201chello world\u201d version has been launched to production and verified by a native speaker."}
	/>
	<ChecklistItem
		bind:item={assessment.data.principles.p4}
		name="p4"
		heading="Principle 4 — Business and developers together"
		prompt="Commitment is in place from every product / project / programme / practice lead."
	/>
</section>
