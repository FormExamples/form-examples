<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.risksBenefits;
</script>

<Fieldset legend="Risks & Benefits">
	<p class="hint">Document the risks, benefits, and expected outcomes of the procedure.</p>

	<Field label="Common Risks" inputId="commonRisks">
		<TextAreaInput
			id="commonRisks"
			label="Common Risks"
			rows={3}
			placeholder="List common risks (e.g., pain, bruising, infection)..."
			bind:value={r.commonRisks}
		/>
	</Field>

	<Field label="Serious Risks" inputId="seriousRisks">
		<TextAreaInput
			id="seriousRisks"
			label="Serious Risks"
			rows={3}
			placeholder="List serious or rare risks (e.g., organ injury, significant bleeding)..."
			bind:value={r.seriousRisks}
		/>
	</Field>

	<Field label="Expected Benefits" inputId="expectedBenefits">
		<TextAreaInput
			id="expectedBenefits"
			label="Expected Benefits"
			rows={3}
			placeholder="Describe the expected benefits of the procedure..."
			bind:value={r.expectedBenefits}
		/>
	</Field>

	<Field label="Success Rate" inputId="successRate">
		<TextInput
			id="successRate"
			label="Success Rate"
			placeholder="e.g., 95% successful outcome"
			bind:value={r.successRate}
		/>
	</Field>

	<Field label="Recovery Period" inputId="recoveryPeriod">
		<TextInput
			id="recoveryPeriod"
			label="Recovery Period"
			placeholder="e.g., 1-2 weeks"
			bind:value={r.recoveryPeriod}
		/>
	</Field>
</Fieldset>
