<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const p = assessment.data.partI;
</script>

<Fieldset legend="Step 4 of 6 — Part I: direct causal sequence">
	<p class="hint">
		The sequence of conditions directly leading to death, read downward: I(a) is the immediate
		cause; each line below records the condition that gave rise to the line above it. I(a) is
		required; a mode of death (for example &ldquo;cardiac arrest&rdquo;) must not stand as the sole
		cause.
	</p>

	<Field
		label="I(a) — disease or condition directly leading to death"
		inputId="partI-causeIaCondition"
	>
		<TextInput
			id="partI-causeIaCondition"
			label="I(a) — disease or condition directly leading to death"
			placeholder="Immediate cause of death"
			bind:value={p.causeIaCondition}
		/>
	</Field>

	<Field label="I(a) — onset-to-death interval" inputId="partI-causeIaInterval">
		<TextInput
			id="partI-causeIaInterval"
			label="I(a) — onset-to-death interval"
			placeholder="e.g. 3 days"
			bind:value={p.causeIaInterval}
		/>
	</Field>

	<Field
		label="I(b) — antecedent condition giving rise to I(a)"
		inputId="partI-causeIbCondition"
	>
		<TextInput
			id="partI-causeIbCondition"
			label="I(b) — antecedent condition giving rise to I(a)"
			placeholder="Antecedent cause (optional)"
			bind:value={p.causeIbCondition}
		/>
	</Field>

	<Field label="I(b) — onset-to-death interval" inputId="partI-causeIbInterval">
		<TextInput
			id="partI-causeIbInterval"
			label="I(b) — onset-to-death interval"
			placeholder="e.g. 12 years"
			bind:value={p.causeIbInterval}
		/>
	</Field>

	<Field
		label="I(c) — underlying condition giving rise to I(b)"
		inputId="partI-causeIcCondition"
	>
		<TextInput
			id="partI-causeIcCondition"
			label="I(c) — underlying condition giving rise to I(b)"
			placeholder="Underlying cause (optional)"
			bind:value={p.causeIcCondition}
		/>
	</Field>

	<Field label="I(c) — onset-to-death interval" inputId="partI-causeIcInterval">
		<TextInput
			id="partI-causeIcInterval"
			label="I(c) — onset-to-death interval"
			placeholder="e.g. 20 years"
			bind:value={p.causeIcInterval}
		/>
	</Field>
</Fieldset>
