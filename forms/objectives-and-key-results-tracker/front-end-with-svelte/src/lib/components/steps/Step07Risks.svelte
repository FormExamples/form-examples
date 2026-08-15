<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="7. Risks" data-step="7">
	<Field label="Known risks" inputId="rkKnownRisks">
		<TextAreaInput id="rkKnownRisks" label="Known risks" rows={3} bind:value={d.risks.rk_known_risks} />
	</Field>

	<Field label="Dependencies" inputId="rkDependencies">
		<TextAreaInput
			id="rkDependencies"
			label="Dependencies"
			rows={3}
			bind:value={d.risks.rk_dependencies}
		/>
	</Field>

	<Field label="Blockers" inputId="rkBlockers">
		<TextAreaInput id="rkBlockers" label="Blockers" rows={3} bind:value={d.risks.rk_blockers} />
	</Field>

	<Field label="Mitigation plans" inputId="rkMitigationPlans">
		<TextAreaInput
			id="rkMitigationPlans"
			label="Mitigation plans"
			rows={3}
			bind:value={d.risks.rk_mitigation_plans}
		/>
	</Field>
</Fieldset>
