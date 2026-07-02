<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const l = assessment.data.leastRestrictive;
</script>

<Fieldset legend="Step 6 of 9 — Least-restrictive alternative (criterion 3)">
	<p class="hint">
		Criterion 3 — the objective cannot be achieved in a less restrictive way (Article 5, right to
		liberty).
	</p>

	<Field
		label="No less restrictive alternative (criterion 3)"
		inputId="leastRestrictive-leastRestrictiveMet"
	>
		<Select
			id="leastRestrictive-leastRestrictiveMet"
			label="No less restrictive alternative (criterion 3)"
			bind:value={l.leastRestrictiveMet}
		>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Alternatives considered" inputId="leastRestrictive-alternativesConsidered">
		<TextAreaInput
			id="leastRestrictive-alternativesConsidered"
			label="Alternatives considered"
			rows={3}
			placeholder="Informal admission, community treatment, or Mental Capacity Act options considered, and why they are insufficient."
			bind:value={l.alternativesConsidered}
		/>
	</Field>
</Fieldset>
