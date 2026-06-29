<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.situation;

	const urgencyOptions = [
		{ value: 'routine', label: 'Routine' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergent', label: 'Emergent' }
	];
	const transferTypeOptions = [
		{ value: 'ward-to-ward', label: 'Ward to ward (same site)' },
		{ value: 'inter-hospital', label: 'Inter-hospital' },
		{ value: 'inter-organisation', label: 'Inter-organisation' },
		{ value: 'community', label: 'To community / home' }
	];
</script>

<Fieldset legend="Situation (S) — Reason for Transfer">
	<p class="hint">Briefly state why the patient needs to be transferred now.</p>

	<Field label="Reason for transfer" required inputId="reasonForTransfer">
		<TextAreaInput
			id="reasonForTransfer"
			label="Reason for transfer"
			rows={3}
			required
			placeholder="e.g. Specialist input required for acute pancreatitis with rising amylase."
			bind:value={d.reasonForTransfer}
		/>
	</Field>

	<Field label="Primary diagnosis" required inputId="primaryDiagnosis">
		<TextInput
			id="primaryDiagnosis"
			label="Primary diagnosis"
			required
			placeholder="e.g. Acute pancreatitis"
			bind:value={d.primaryDiagnosis}
		/>
	</Field>

	<Field label="Transfer urgency" required>
		<RadioGroup label="Transfer urgency">
			{#each urgencyOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="urgency" value={opt.value} bind:group={d.urgency} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Transfer type" required>
		<RadioGroup label="Transfer type">
			{#each transferTypeOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="transferType" value={opt.value} bind:group={d.transferType} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Requested transfer date / time" inputId="requestedDateTime">
		<DateTimeInput
			id="requestedDateTime"
			label="Requested transfer date / time"
			bind:value={d.requestedDateTime}
		/>
	</Field>
</Fieldset>
