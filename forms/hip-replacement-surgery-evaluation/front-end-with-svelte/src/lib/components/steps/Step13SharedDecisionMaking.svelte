<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="13. Shared Decision-making">
	<p class="hint">Confirms the patient was given the information needed to consent to surgery.</p>

	<Field label="Risks and benefits discussed" inputId="decisionMaking-risksAndBenefitsDiscussed">
		<Select id="decisionMaking-risksAndBenefitsDiscussed" label="Risks and benefits discussed" bind:value={d.decisionMaking.risksAndBenefitsDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Realistic expectations discussed" inputId="decisionMaking-realisticExpectationsDiscussed">
		<Select id="decisionMaking-realisticExpectationsDiscussed" label="Realistic expectations discussed" bind:value={d.decisionMaking.realisticExpectationsDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Patient decision aid given" inputId="decisionMaking-patientDecisionAidGiven">
		<Select id="decisionMaking-patientDecisionAidGiven" label="Patient decision aid given" bind:value={d.decisionMaking.patientDecisionAidGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interpreter required" inputId="decisionMaking-interpreterRequired">
		<Select id="decisionMaking-interpreterRequired" label="Interpreter required" bind:value={d.decisionMaking.interpreterRequired}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.decisionMaking.interpreterRequired === 'yes'}
		<Field label="Interpreter language" inputId="decisionMaking-interpreterLanguage">
			<TextInput id="decisionMaking-interpreterLanguage" label="Interpreter language" bind:value={d.decisionMaking.interpreterLanguage} />
		</Field>
	{/if}
</Fieldset>
