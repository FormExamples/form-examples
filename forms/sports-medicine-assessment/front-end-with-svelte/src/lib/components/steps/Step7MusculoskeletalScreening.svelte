<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.musculoskeletalScreening;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Musculoskeletal Screening">
	<p class="hint">Injury history, joint stability, range of motion, and strength.</p>

	<Field label="Uncorrected major injury?">
		<RadioGroup label="Uncorrected major injury?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="majorInjury" value={opt.value} bind:group={m.uncorrectedMajorInjury} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.uncorrectedMajorInjury === 'yes'}
		<Field label="Major injury details" inputId="majorInjuryDetails">
			<TextAreaInput id="majorInjuryDetails" label="Major injury details" rows={2} bind:value={m.majorInjuryDetails} />
		</Field>
	{/if}

	<Field label="Joint instability?">
		<RadioGroup label="Joint instability?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="jointInstability" value={opt.value} bind:group={m.jointInstability} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.jointInstability === 'yes'}
		<Field label="Joint instability details" inputId="jointInstabilityDetails">
			<TextAreaInput id="jointInstabilityDetails" label="Joint instability details" rows={2} bind:value={m.jointInstabilityDetails} />
		</Field>
	{/if}

	<Field label="Ongoing pain or swelling?">
		<RadioGroup label="Ongoing pain or swelling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="painSwelling" value={opt.value} bind:group={m.ongoingPainOrSwelling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Chronic joint disease (e.g. arthritis)?">
		<RadioGroup label="Chronic joint disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chronicJoint" value={opt.value} bind:group={m.chronicJointDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uses a brace or assistive device?">
		<RadioGroup label="Uses a brace or assistive device?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="brace" value={opt.value} bind:group={m.useBraceOrAssistiveDevice} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Full range of motion?">
		<RadioGroup label="Full range of motion?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rom" value={opt.value} bind:group={m.fullRangeOfMotion} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Normal bilateral strength?">
		<RadioGroup label="Normal bilateral strength?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="strength" value={opt.value} bind:group={m.normalStrengthBilateral} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
