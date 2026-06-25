<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Follow-up">
	<p class="hint">Cascade testing of at-risk relatives and recommended follow-up.</p>

	<Field label="Cascade testing">
		<CheckboxGroup label="Cascade testing">
			<label>
				<CheckboxInput
					label="Cascade (predictive) testing of at-risk relatives recommended"
					bind:checked={d.recommendedCascadeTesting}
				/> Cascade (predictive) testing of at-risk relatives recommended
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Referral, surveillance, genetic counselling, or further testing…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
