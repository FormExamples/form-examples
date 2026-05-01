<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const data = assessment.data;
	const pre = data.preConfinement;
</script>

<SectionCard
	title="Part A — Pre-Confinement Certificate"
	description="Complete Part A only when the certificate is being issued before the birth. Part A and Part B are mutually exclusive."
>
	<RadioGroup
		label="Certificate type"
		name="certificateType"
		options={[
			{ value: 'pre', label: 'Part A — Pre-confinement (pregnancy ongoing)' },
			{ value: 'post', label: 'Part B — Post-confinement (baby has been born)' }
		]}
		bind:value={data.certificateType}
		required
	/>

	{#if data.certificateType === 'pre'}
		<div class="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
			DWP guidance: a MAT B1 must not be issued more than 20 weeks before the
			expected date of confinement (EWC).
		</div>

		<TextInput
			label="Expected date of confinement (EWC)"
			name="ewc"
			type="date"
			bind:value={pre.expectedDateOfConfinement}
			required
		/>

		<TextInput
			label="Examination date"
			name="examinationDate"
			type="date"
			bind:value={pre.examinationDate}
			required
		/>
	{:else if data.certificateType === 'post'}
		<p class="mt-2 text-sm text-gray-500">
			Part B (post-confinement) selected — complete Step 3 instead.
		</p>
	{:else}
		<p class="mt-2 text-sm text-gray-500">
			Select a certificate type above to continue.
		</p>
	{/if}
</SectionCard>
