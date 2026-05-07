<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const d = assessment.data.followupPlan;
</script>

<SectionCard title="Follow-up Plan" description="Disposition and next steps following this encounter">
	<SelectInput
		label="Disposition"
		name="disposition"
		options={[
			{ value: 'discharge', label: 'Discharge — no further follow-up required' },
			{ value: 'pifu', label: 'Patient-Initiated Follow-Up (PIFU)' },
			{ value: 'follow_up_booked', label: 'Follow-up appointment booked' },
			{ value: 'onward_referral', label: 'Onward referral to another service' }
		]}
		bind:value={d.disposition}
	/>

	{#if d.disposition === 'follow_up_booked'}
		<TextInput
			label="Next Appointment Date"
			name="nextAppointmentDate"
			type="date"
			bind:value={d.nextAppointmentDate}
		/>
	{/if}

	{#if d.disposition === 'onward_referral'}
		<TextInput
			label="Onward Referral Specialty"
			name="onwardReferralSpecialty"
			bind:value={d.onwardReferralSpecialty}
			placeholder="e.g. Rheumatology"
		/>
	{/if}

	<TextArea
		label="Follow-up Notes"
		name="followupNotes"
		bind:value={d.followupNotes}
		placeholder="Any additional instructions, safety-netting advice, or relevant notes"
		rows={3}
	/>
</SectionCard>
