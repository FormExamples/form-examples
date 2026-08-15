<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const j = assessment.data.job;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Job context">
	<p class="hint">The employee's role, hours, and any safety-critical or notifiable status.</p>

	<Field label="Job title" inputId="jobTitle">
		<TextInput id="jobTitle" label="Job title" bind:value={j.jobTitle} />
	</Field>

	<Field label="Role description" inputId="roleDescription">
		<TextAreaInput id="roleDescription" label="Role description" rows={2} bind:value={j.roleDescription} />
	</Field>

	<Field label="Contracted hours per week" inputId="contractedHours">
		<NumberInput id="contractedHours" label="Contracted hours per week" min={0} max={168} step="0.5" bind:value={j.contractedHours} />
	</Field>

	<Field label="Shift pattern" inputId="shiftPattern">
		<TextInput id="shiftPattern" label="Shift pattern" placeholder="e.g. Days, Nights, Rotating" bind:value={j.shiftPattern} />
	</Field>

	<Field label="Is this a safety-critical role?">
		<RadioGroup label="Is this a safety-critical role?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safetyCritical" value={opt.value} bind:group={j.safetyCritical} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is this a DVLA-notifiable driving role?">
		<RadioGroup label="Is this a DVLA-notifiable driving role?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dvlaNotifiableRole" value={opt.value} bind:group={j.dvlaNotifiableRole} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Employer industry sector" inputId="industrySector">
		<TextInput id="industrySector" label="Employer industry sector" bind:value={j.industrySector} />
	</Field>
</Fieldset>
