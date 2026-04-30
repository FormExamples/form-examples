<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const l = assessment.data.laserTreatment;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 6 — Laser Treatment"
	description="Do not include treatment for long or short sightedness, or for cataracts."
>
	<RadioGroup
		label="Have you had laser treatment for an eye condition?"
		name="laserHasHad"
		options={yesNoOptions}
		bind:value={l.hasHadTreatment}
		required
	/>

	{#if l.hasHadTreatment === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<h3 class="mb-2 text-sm font-medium text-gray-700">6a) Date of first treatment</h3>
			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput
					label="Left eye"
					name="laserLeftFirstDate"
					type="date"
					bind:value={l.leftEyeFirstDate}
				/>
				<TextInput
					label="Right eye"
					name="laserRightFirstDate"
					type="date"
					bind:value={l.rightEyeFirstDate}
				/>
			</div>

			<h3 class="mt-2 mb-2 text-sm font-medium text-gray-700">6b) Date of last treatment</h3>
			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput
					label="Left eye"
					name="laserLeftLastDate"
					type="date"
					bind:value={l.leftEyeLastDate}
				/>
				<TextInput
					label="Right eye"
					name="laserRightLastDate"
					type="date"
					bind:value={l.rightEyeLastDate}
				/>
			</div>
		</div>
	{/if}
</SectionCard>
