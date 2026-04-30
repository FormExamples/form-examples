<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const v = assessment.data.vehicleAdaptations;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 12 — Vehicle adaptations"
	description="Tell us about any special controls or automatic transmission you require."
>
	<RadioGroup
		label="Do you need to drive a vehicle fitted with special controls or automatic transmission?"
		name="needsAdaptations"
		options={yesNo}
		bind:value={v.needsAdaptations}
		required
	/>

	{#if v.needsAdaptations === 'yes'}
		<RadioGroup
			label="a) Have you told us before that you need special controls or automatic transmission?"
			name="previouslyDeclared"
			options={yesNo}
			bind:value={v.previouslyDeclared}
			required
		/>

		{#if v.previouslyDeclared === 'yes'}
			<RadioGroup
				label="b) Since your last licence was issued, have you had any additional controls fitted to your vehicle?"
				name="additionalControlsFitted"
				options={yesNo}
				bind:value={v.additionalControlsFitted}
				required
			/>
		{/if}
	{/if}

	<p class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
		If you have any relevant hospital notes about your medical condition, please send
		copies with this form.
	</p>
</SectionCard>
