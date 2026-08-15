<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.advanceDirectives;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Advance Directives & Consent">
	<p class="hint">DNR orders, living wills, and patient consent for cross-border IPS exchange.</p>

	<Field label="Is a DNR (Do Not Resuscitate) order in place?">
		<RadioGroup label="Is a DNR (Do Not Resuscitate) order in place?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dnrInPlace" value={opt.value} bind:group={d.dnrInPlace} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is a living will / advance decision in place?">
		<RadioGroup label="Is a living will / advance decision in place?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="livingWillInPlace" value={opt.value} bind:group={d.livingWillInPlace} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Has the patient consented to share this IPS for cross-border / EU-wide care?">
		<RadioGroup label="Has the patient consented to share this IPS for cross-border / EU-wide care?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToShareEu" value={opt.value} bind:group={d.consentToShareEu} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Directive notes" inputId="directiveNotes">
		<TextAreaInput id="directiveNotes" label="Directive notes" rows={3} placeholder="Free-text notes about advance directives or consent…" bind:value={d.directiveNotes} />
	</Field>
</Fieldset>
