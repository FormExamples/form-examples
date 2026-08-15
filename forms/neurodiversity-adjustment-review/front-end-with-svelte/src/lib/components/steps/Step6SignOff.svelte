<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Sign-off">
	<p class="hint">
		Record any escalation and sign-off notes. The four-axis grade, review flags, and recommendation
		are computed when you submit.
	</p>

	<Field label="Escalation">
		<CheckboxGroup label="Escalation">
			<label>
				<CheckboxInput
					label="The matter has been escalated (e.g. unresolved difficulty, dispute, or grievance)"
					bind:checked={d.escalated}
				/> The matter has been escalated (e.g. unresolved difficulty, dispute, or grievance)
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.escalated}
		<Field label="Escalation detail" inputId="escalationDetail">
			<TextAreaInput
				id="escalationDetail"
				label="Escalation detail"
				rows={3}
				placeholder="e.g. Worker has raised a formal grievance about the unactioned desk move…"
				bind:value={d.escalationDetail}
			/>
		</Field>

		<Alert type="error" heading="Escalation in progress">
			<p>
				An escalation drives the next-step urgency to escalate and raises the escalation flag.
				Follow the escalation / grievance procedure.
			</p>
		</Alert>
	{/if}

	<Field label="Notes" inputId="notes" description="Free-text notes accompanying the review.">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Any other notes about the review…"
			bind:value={d.notes}
		/>
	</Field>

	<Field label="Sign-off">
		<CheckboxGroup label="Sign-off">
			<label>
				<CheckboxInput
					label="I confirm this review record is accurate and complete"
					bind:checked={d.signed}
				/> I confirm this review record is accurate and complete
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
