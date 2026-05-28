<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calcWaitDays } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.operationalEfficiency;

	// Auto-derive wait time days from dates when both are set
	$effect(() => {
		const derived = calcWaitDays(d.referralDate, d.appointmentDate);
		if (derived !== null) {
			assessment.data.operationalEfficiency.waitTimeDays = derived;
		}
	});
</script>

<Fieldset title="Operational Efficiency" description="Referral and appointment timing">
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Referral Date" name="referralDate" type="date" bind:value={d.referralDate} />
		<TextInput label="Appointment Date" name="appointmentDate" type="date" bind:value={d.appointmentDate} />
	</div>

	<div class="mb-4">
		<span class="mb-1 block text-sm font-medium text-gray-700">Wait Time (days)</span>
		{#if d.waitTimeDays !== null}
			<div class="flex h-[38px] items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm">
				<span class="font-medium">{d.waitTimeDays} days</span>
				{#if d.serviceTargetDays}
					<span class="ml-2 text-gray-500">
						({Math.round((d.waitTimeDays / d.serviceTargetDays) * 100)}% of target)
					</span>
				{/if}
			</div>
			<p class="mt-1 text-xs text-gray-400">Auto-calculated from dates above</p>
		{:else}
			<NumberInput label="" name="waitTimeDays" bind:value={d.waitTimeDays} unit="days" min={0} />
		{/if}
	</div>

	<NumberInput
		label="Service Target (days)"
		name="serviceTargetDays"
		bind:value={d.serviceTargetDays}
		unit="days"
		min={1}
		placeholder="e.g. 18 for 18-week RTT"
	/>

	<Select
		label="NHS Attendance Outcome"
		name="nhsAttendanceOutcome"
		options={[
			{ value: 'attended_discharged', label: 'Attended — Discharged' },
			{ value: 'attended_follow_up', label: 'Attended — Follow-up booked' },
			{ value: 'attended_pifu', label: 'Attended — PIFU pathway' },
			{ value: 'attended_onward_referral', label: 'Attended — Onward referral' },
			{ value: 'patient_cancelled', label: 'Patient cancelled or rebooked' },
			{ value: 'patient_dna', label: 'Patient Did Not Attend (DNA)' },
			{ value: 'provider_cancelled', label: 'Provider cancelled' }
		]}
		bind:value={d.nhsAttendanceOutcome}
	/>
</Fieldset>
