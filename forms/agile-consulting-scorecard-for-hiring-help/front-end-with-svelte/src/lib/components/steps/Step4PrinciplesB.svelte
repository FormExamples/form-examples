<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ChecklistField from '$lib/components/ChecklistField.svelte';
	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="4. Principles 5–8">
	<ChecklistField
		bind:item={d.principles.p5}
		name="p5"
		heading="Principle 5 — Motivated individuals"
		prompt={"A “3-amigos” team (business + dev + test) has shipped a real new MVP within 30 days and on budget."}
	/>
	<ChecklistField
		bind:item={d.principles.p6}
		name="p6"
		heading="Principle 6 — Face-to-face conversation"
		prompt={"Every product owner has committed to ≥ 50% face-to-face time (or weekly-video equivalent for remote teams)."}
	/>
	<ChecklistField
		bind:item={d.principles.p7}
		name="p7"
		heading="Principle 7 — Working software is the primary measure"
		prompt={"A new “fizz buzz” program has been created and shipped to production."}
	/>
	<ChecklistField
		bind:item={d.principles.p8}
		name="p8"
		heading="Principle 8 — Sustainable pace"
		prompt={"All staff have a sustaining budget for ≥ 1 year secured."}
	/>
</Fieldset>
