<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="13. Shared Decision-making">
	<p class="hint">What was discussed with the patient before a recommendation is made.</p>

	<Field label="Risks and benefits discussed" inputId="sharedDecision-risksBenefitsDiscussed">
		<Select id="sharedDecision-risksBenefitsDiscussed" label="Risks and benefits discussed" bind:value={d.sharedDecision.risksBenefitsDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Realistic expectations discussed" inputId="sharedDecision-realisticExpectationsDiscussed">
		<Select id="sharedDecision-realisticExpectationsDiscussed" label="Realistic expectations discussed" bind:value={d.sharedDecision.realisticExpectationsDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Patient decision aid given" inputId="sharedDecision-patientDecisionAidGiven">
		<Select id="sharedDecision-patientDecisionAidGiven" label="Patient decision aid given" bind:value={d.sharedDecision.patientDecisionAidGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interpreter required" inputId="sharedDecision-interpreterRequired">
		<Select id="sharedDecision-interpreterRequired" label="Interpreter required" bind:value={d.sharedDecision.interpreterRequired}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
