<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="14. Management Plan and Recommendation">
	<p class="hint">
		The clinician's plan. A recommendation for surgery here without pre-op bloods complete or
		conservative measures exhausted raises the corresponding safety flags on the summary step.
	</p>

	<Field label="Recommendation" inputId="plan-planRecommendation" required>
		<Select id="plan-planRecommendation" label="Recommendation" bind:value={d.plan.planRecommendation} required>
			<option value="">— Select —</option>
			{#each OPTIONS.planRecommendation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Target list date" inputId="plan-targetListDate">
		<DateInput id="plan-targetListDate" label="Target list date" bind:value={d.plan.targetListDate} />
	</Field>
	<Field label="Responsible surgeon" inputId="plan-responsibleSurgeon">
		<TextInput id="plan-responsibleSurgeon" label="Responsible surgeon" bind:value={d.plan.responsibleSurgeon} />
	</Field>
</Fieldset>
