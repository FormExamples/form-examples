<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const v = assessment.data.visitInformation;
</script>

<Fieldset legend="Visit Information">
	<p class="hint">Details about your recent healthcare visit.</p>

	<Field label="Visit Date" required inputId="visitDate">
		<DateInput id="visitDate" label="Visit Date" required bind:value={v.visitDate} />
	</Field>

	<Field label="Department / Clinic" required inputId="department">
		<TextInput
			id="department"
			label="Department / Clinic"
			placeholder="e.g. Primary Care, Cardiology"
			required
			bind:value={v.department}
		/>
	</Field>

	<Field label="Provider Name" required inputId="providerName">
		<TextInput
			id="providerName"
			label="Provider Name"
			placeholder="e.g. Dr. Smith"
			required
			bind:value={v.providerName}
		/>
	</Field>

	<Field label="Visit Type" required inputId="visitType">
		<Select id="visitType" label="Visit Type" required bind:value={v.visitType}>
			<option value="">-- Select --</option>
			<option value="routine-checkup">Routine Check-up</option>
			<option value="follow-up">Follow-up Visit</option>
			<option value="urgent-care">Urgent Care</option>
			<option value="specialist-referral">Specialist Referral</option>
			<option value="procedure">Procedure</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Reason for Visit" inputId="reasonForVisit">
		<TextAreaInput
			id="reasonForVisit"
			label="Reason for Visit"
			placeholder="Briefly describe the reason for your visit"
			bind:value={v.reasonForVisit}
		/>
	</Field>

	<Field label="Was this your first visit to this provider?" required>
		<RadioGroup label="Was this your first visit to this provider?">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="firstVisit"
					value="yes"
					bind:group={v.firstVisit}
					required
				/>
				Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="firstVisit"
					value="no"
					bind:group={v.firstVisit}
					required
				/>
				No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
