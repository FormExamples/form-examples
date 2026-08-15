<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const r = assessment.data.referralInfo;
</script>

<Fieldset legend="Referral Information">
	<p class="hint">Details about the referral and sport/activity.</p>

	<Field label="Referring Provider" required inputId="referringProvider">
		<TextInput
			id="referringProvider"
			label="Referring Provider"
			placeholder="e.g., Dr. Smith, GP"
			required
			bind:value={r.referringProvider}
		/>
	</Field>

	<Field label="Reason for Referral" inputId="referralReason">
		<TextAreaInput
			id="referralReason"
			label="Reason for Referral"
			rows={3}
			placeholder="e.g., Pre-season screening, injury prevention, return-to-sport clearance"
			bind:value={r.referralReason}
		/>
	</Field>

	<Field label="Referral Date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral Date" bind:value={r.referralDate} />
	</Field>

	<Field label="Primary Sport or Activity" required inputId="sportOrActivity">
		<TextInput
			id="sportOrActivity"
			label="Primary Sport or Activity"
			placeholder="e.g., Football, Running, Basketball, CrossFit"
			required
			bind:value={r.sportOrActivity}
		/>
	</Field>
</Fieldset>
