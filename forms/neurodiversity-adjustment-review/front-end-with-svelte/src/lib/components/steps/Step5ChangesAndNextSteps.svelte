<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	const changesOutstanding = $derived(d.changesNeeded && d.changesDetail.trim() === '');
</script>

<Fieldset legend="5. Changes &amp; Next Steps">
	<p class="hint">
		Record any changes to the adjustments arising from the review, the updated adjustments agreed,
		and whether an occupational-health re-referral is needed. The next review date is set in the
		review identification section.
	</p>

	<Field label="Changes needed">
		<CheckboxGroup label="Changes needed">
			<label>
				<CheckboxInput
					label="Changes to the adjustments are needed as a result of this review"
					bind:checked={d.changesNeeded}
				/> Changes to the adjustments are needed as a result of this review
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.changesNeeded}
		<Field
			label="Changes detail"
			inputId="changesDetail"
			description="Describe the changes needed."
		>
			<TextAreaInput
				id="changesDetail"
				label="Changes detail"
				rows={4}
				placeholder="e.g. Bring forward the agreed desk move; add a weekly check-in with the mentor…"
				bind:value={d.changesDetail}
			/>
		</Field>
	{/if}

	<Field
		label="Updated / newly agreed adjustments"
		inputId="updatedAdjustmentsDetail"
		description="Detail of any updated or newly agreed adjustments arising from the review."
	>
		<TextAreaInput
			id="updatedAdjustmentsDetail"
			label="Updated / newly agreed adjustments"
			rows={3}
			placeholder="e.g. Added a second screen and a written-agenda routine for team meetings…"
			bind:value={d.updatedAdjustmentsDetail}
		/>
	</Field>

	<Field label="Occupational-health re-referral">
		<CheckboxGroup label="Occupational-health re-referral">
			<label>
				<CheckboxInput
					label="An occupational-health re-referral has been made as a result of this review"
					bind:checked={d.occupationalHealthRereferral}
				/> An occupational-health re-referral has been made as a result of this review
			</label>
		</CheckboxGroup>
	</Field>

	{#if changesOutstanding}
		<Alert type="warning" heading="Changes outstanding">
			<p>Changes are marked as needed but not yet detailed. Record and action the required changes.</p>
		</Alert>
	{/if}
</Fieldset>
