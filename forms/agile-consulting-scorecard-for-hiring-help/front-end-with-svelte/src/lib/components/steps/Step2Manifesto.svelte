<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ChecklistField from '#lib/components/ChecklistField.svelte';
	import { assessment } from '#lib/stores/assessment.svelte.js';

	const d = $state(assessment.data);
</script>

<Fieldset legend="2. Agile Manifesto (4 items)">
	<p class="hint">Score one point per item your organization can demonstrably tick today.</p>

	<ChecklistField
		bind:item={d.manifesto.m1}
		name="m1"
		heading="Manifesto 1 — Individuals and interactions"
		prompt="Every leader is in conversation with customers ≥ 1 hour per week, with weekly results radiated to stakeholders."
	/>
	<ChecklistField
		bind:item={d.manifesto.m2}
		name="m2"
		heading="Manifesto 2 — Working software"
		prompt={"The team has launched a brand-new “hello world” program to production and discussed the experience."}
	/>
	<ChecklistField
		bind:item={d.manifesto.m3}
		name="m3"
		heading="Manifesto 3 — Customer collaboration"
		prompt={"The organization has bought copies of the customer’s favourite book and shared with the team (org spend, not personal)."}
	/>
	<ChecklistField
		bind:item={d.manifesto.m4}
		name="m4"
		heading="Manifesto 4 — Responding to change"
		prompt="Every senior leader (BoD/CXO/VP/Director) has read one agile change-management book and shared three takeaways."
	/>
</Fieldset>
