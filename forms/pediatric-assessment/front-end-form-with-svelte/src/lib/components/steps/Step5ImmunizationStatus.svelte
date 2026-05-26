<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const im = assessment.data.immunizationStatus;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Immunization Status">
	<p class="hint">Vaccination record and any concerns.</p>

	<Field label="Are the child's immunizations up to date?" required>
		<RadioGroup label="Immunizations up to date">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="upToDate" value={opt.value} bind:group={im.upToDate} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if im.upToDate === 'no'}
		<Field label="Which vaccinations are missing?" inputId="missingVacc">
			<TextAreaInput id="missingVacc" label="Missing vaccinations" rows={3} bind:value={im.missingVaccinations} />
		</Field>
	{/if}

	<Field label="Has the child had any adverse reactions to vaccinations?">
		<RadioGroup label="Adverse reactions">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="adverseReactions" value={opt.value} bind:group={im.adverseReactions} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if im.adverseReactions === 'yes'}
		<Field label="Please describe the adverse reaction(s)" inputId="adverseDetails">
			<TextAreaInput id="adverseDetails" label="Adverse reaction details" rows={3} bind:value={im.adverseReactionDetails} />
		</Field>
	{/if}

	<Field label="Are there any vaccination exemptions?">
		<RadioGroup label="Vaccination exemptions">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="exemptions" value={opt.value} bind:group={im.exemptions} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if im.exemptions === 'yes'}
		<Field label="Please describe the exemption(s)" inputId="exemptionDetails">
			<TextAreaInput id="exemptionDetails" label="Exemption details" rows={3} bind:value={im.exemptionDetails} />
		</Field>
	{/if}
</Fieldset>
