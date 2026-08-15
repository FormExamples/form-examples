<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.doubleVision;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 9 — Double Vision (Diplopia)"
	description="Double vision is seeing two of a single object at the same time."
>
	<RadioGroup
		label="Do you have double vision?"
		name="dvHasCondition"
		options={yesNoOptions}
		bind:value={d.hasCondition}
		required
	/>

	{#if d.hasCondition === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="9a) Is your double vision controlled (e.g. by patch, prism, frosted glasses, or lenses)?"
				name="dvControlled"
				options={yesNoOptions}
				bind:value={d.controlled}
				required
			/>

			{#if d.controlled === 'no'}
				<RadioGroup
					label="9b) Has the double vision been the same for 6 months or more?"
					name="dvSameSixMonths"
					options={yesNoOptions}
					bind:value={d.sameForSixMonthsOrMore}
					required
				/>
			{/if}

			<div class="mt-4 rounded-lg border border-info/40 bg-info/10 p-3 text-sm text-base-content">
				<strong>Adaptation declaration:</strong> a 3-month adaptation period is normally
				required when driving with a patch, prism, frosted glasses, or lens that controls
				double vision. Your ability to judge distances may be affected and you may not be
				aware of objects on each side. You must not drive until adapted.
			</div>

			<Checkbox
				label="I confirm I have adapted to driving with my double-vision treatment as described, or I am not currently driving."
				name="dvDeclarationConfirmed"
				bind:checked={d.doubleVisionDeclarationConfirmed}
				required
			/>

			<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
				<TextInput
					label="Signature (full name)"
					name="dvSignatureName"
					bind:value={d.declarationSignatureName}
					required
				/>
				<TextInput
					label="Date"
					name="dvDeclarationDate"
					type="date"
					bind:value={d.declarationDate}
					required
				/>
			</div>
		</div>
	{/if}
</Fieldset>
