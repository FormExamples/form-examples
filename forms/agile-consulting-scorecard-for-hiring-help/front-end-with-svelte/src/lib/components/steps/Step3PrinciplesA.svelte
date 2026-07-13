<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ChecklistField from '$lib/components/ChecklistField.svelte';
	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="3. Principles 1–4">
	<ChecklistField
		bind:item={d.principles.p1}
		name="p1"
		heading="Principle 1 — Customer satisfaction"
		prompt="Every product lead measures customer Net Promoter Score (NPS)."
	/>
	<ChecklistField
		bind:item={d.principles.p2}
		name="p2"
		heading="Principle 2 — Welcome changing requirements"
		prompt={"The “hello world” program has been internationalized to ≥ 1 additional language using the user locale."}
	/>
	<ChecklistField
		bind:item={d.principles.p3}
		name="p3"
		heading="Principle 3 — Deliver working software frequently"
		prompt={"The internationalized “hello world” version has been launched to production and verified by a native speaker."}
	/>
	<ChecklistField
		bind:item={d.principles.p4}
		name="p4"
		heading="Principle 4 — Business and developers together"
		prompt="Commitment is in place from every product / project / programme / practice lead."
	/>
</Fieldset>
