<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.donationPlan;
</script>

<Fieldset legend="Donation Plan">
	<p class="hint">What kind of donation are you here for today?</p>

	<Field label="Planned donation type" inputId="plannedDonationType">
		<Select id="plannedDonationType" label="Planned donation type" bind:value={p.plannedDonationType}>
			<option value="">-- Select --</option>
			<option value="whole-blood">Whole blood</option>
			<option value="plasma">Plasma</option>
			<option value="platelets">Platelets</option>
			<option value="red-cells">Red cells (double red apheresis)</option>
		</Select>
	</Field>

	<Field label="Preferred donation date" inputId="preferredDonationDate">
		<DateInput id="preferredDonationDate" label="Preferred donation date" bind:value={p.preferredDonationDate} />
	</Field>

	<Field label="Session / centre" inputId="session">
		<TextInput id="session" label="Session / centre" placeholder="e.g. Manchester Plymouth Grove" bind:value={p.session} />
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} placeholder="Anything else the session staff should know…" bind:value={p.notes} />
	</Field>
</Fieldset>
