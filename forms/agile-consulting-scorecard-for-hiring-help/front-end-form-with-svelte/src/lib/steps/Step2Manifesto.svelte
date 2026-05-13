<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
</script>

<section>
	<h2 class="text-lg font-semibold text-slate-800">Step 2 — Agile Manifesto (4 items)</h2>
	<p class="text-sm text-slate-600 mt-1">
		Score one point per item your organization can demonstrably tick today.
	</p>

	<ChecklistItem
		bind:item={assessment.data.manifesto.m1}
		name="m1"
		heading="Manifesto 1 — Individuals and interactions"
		prompt="Every leader is in conversation with customers ≥ 1 hour per week, with weekly results radiated to stakeholders."
	/>
	<ChecklistItem
		bind:item={assessment.data.manifesto.m2}
		name="m2"
		heading="Manifesto 2 — Working software"
		prompt={"The team has launched a brand-new \u201chello world\u201d program to production and discussed the experience."}
	/>
	<ChecklistItem
		bind:item={assessment.data.manifesto.m3}
		name="m3"
		heading="Manifesto 3 — Customer collaboration"
		prompt={"The organization has bought copies of the customer\u2019s favourite book and shared with the team (org spend, not personal)."}
	/>
	<ChecklistItem
		bind:item={assessment.data.manifesto.m4}
		name="m4"
		heading="Manifesto 4 — Responding to change"
		prompt="Every senior leader (BoD/CXO/VP/Director) has read one agile change-management book and shared three takeaways."
	/>
</section>
