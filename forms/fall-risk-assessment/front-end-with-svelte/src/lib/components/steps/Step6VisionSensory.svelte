<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.visionSensory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Vision & Sensory Assessment">
	<p class="hint">Visual, hearing, and peripheral sensory function.</p>

	<Field label="Vision impairment?">
		<RadioGroup label="Vision impairment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="visionImpairment" value={opt.value} bind:group={v.visionImpairment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if v.visionImpairment === 'yes'}
		<Field label="Vision corrected with glasses or contact lenses?">
			<RadioGroup label="Vision corrected with glasses or contact lenses?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="visionCorrected" value={opt.value} bind:group={v.visionCorrected} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Hearing impairment?">
		<RadioGroup label="Hearing impairment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hearingImpairment" value={opt.value} bind:group={v.hearingImpairment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Peripheral neuropathy (loss of sensation in the feet)?">
		<RadioGroup label="Peripheral neuropathy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="peripheralNeuropathy" value={opt.value} bind:group={v.peripheralNeuropathy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Cataracts?">
		<RadioGroup label="Cataracts?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cataracts" value={opt.value} bind:group={v.cataracts} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Glaucoma?">
		<RadioGroup label="Glaucoma?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="glaucoma" value={opt.value} bind:group={v.glaucoma} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Macular degeneration?">
		<RadioGroup label="Macular degeneration?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="macularDegeneration" value={opt.value} bind:group={v.macularDegeneration} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Vision last checked" inputId="visionLastChecked">
		<DateInput id="visionLastChecked" label="Vision last checked" bind:value={v.visionLastChecked} />
	</Field>

	<Field label="Sensory notes" inputId="sensoryNotes">
		<TextAreaInput id="sensoryNotes" label="Sensory notes" rows={3} bind:value={v.sensoryNotes} />
	</Field>
</Fieldset>
