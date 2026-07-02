<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Assessment context">
	<p class="hint">When and where the assessment is convened, and why.</p>

	<Field label="Date and time of assessment" inputId="context-assessedAt">
		<TextInput
			id="context-assessedAt"
			label="Date and time of assessment"
			type="datetime-local"
			class="date-input"
			bind:value={c.assessedAt}
		/>
	</Field>

	<Field label="Location / setting" inputId="context-location">
		<Select id="context-location" label="Location / setting" bind:value={c.location}>
			<option value="">— Select —</option>
			<option value="hospital-ward">Hospital ward</option>
			<option value="emergency-department">Emergency department</option>
			<option value="place-of-safety">Place of safety (s136 suite)</option>
			<option value="care-home">Care home</option>
			<option value="community">Community / person’s home</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Referral source" inputId="context-referralSource">
		<TextInput
			id="context-referralSource"
			label="Referral source"
			placeholder="Who requested the assessment"
			bind:value={c.referralSource}
		/>
	</Field>

	<Field label="Reason for assessment" inputId="context-reasonForAssessment">
		<TextAreaInput
			id="context-reasonForAssessment"
			label="Reason for assessment"
			rows={3}
			placeholder="Presenting concern that prompted the assessment."
			bind:value={c.reasonForAssessment}
		/>
	</Field>
</Fieldset>
