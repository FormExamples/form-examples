<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const so = assessment.data.signOff;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Sign-off">
	<p class="hint">
		The restriction-priority grade and safety flags are computed on submit. The clinician may
		override the computed fitness statement with a documented reason.
	</p>

	<Field label="Override the computed fitness statement?">
		<RadioGroup label="Override the computed fitness statement?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clinicianOverride" value={opt.value} bind:group={so.clinicianOverride} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if so.clinicianOverride === 'yes'}
		<Field label="Override outcome" inputId="overrideOutcome">
			<Select id="overrideOutcome" label="Override outcome" bind:value={so.overrideOutcome}>
				<option value="">-- Select --</option>
				<option value="fit">Fit for work</option>
				<option value="may-be-fit">May be fit for work — with adjustments</option>
				<option value="not-fit">Not fit for work</option>
			</Select>
		</Field>

		<Field label="Override reason" inputId="overrideReason">
			<TextAreaInput id="overrideReason" label="Override reason" rows={2} bind:value={so.overrideReason} />
		</Field>
	{/if}

	<Field label="Final notes" inputId="finalNotes">
		<TextAreaInput id="finalNotes" label="Final notes" rows={3} bind:value={so.finalNotes} />
	</Field>

	<Field label="Electronic signature" inputId="signOffSignature">
		<TextInput id="signOffSignature" label="Electronic signature" bind:value={so.signature} />
	</Field>
</Fieldset>
