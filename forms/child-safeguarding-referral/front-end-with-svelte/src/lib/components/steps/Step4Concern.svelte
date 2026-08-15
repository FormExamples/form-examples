<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.concern;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 9 — The concern">
	<p class="hint">What the concern or allegation is, and how it came to light.</p>

	<Field
		label="Description of the concern or allegation"
		description="A concise, factual description of what has happened or been observed."
		required
		inputId="concern-concernDescription"
	>
		<TextAreaInput
			id="concern-concernDescription"
			label="Description of the concern or allegation"
			rows={4}
			placeholder="e.g. Repeated unexplained bruising; child fearful of going home."
			required
			bind:value={c.concernDescription}
		/>
	</Field>

	<Field label="When and how it came to light" inputId="concern-concernOnset">
		<TextAreaInput
			id="concern-concernOnset"
			label="When and how it came to light"
			rows={2}
			placeholder="e.g. Disclosed to class teacher on 30 June during lunch."
			bind:value={c.concernOnset}
		/>
	</Field>

	<Field
		label="Has the child made a disclosure of abuse?"
		description="A disclosure raises a high-priority flag and drives urgency."
	>
		<RadioGroup label="Has the child made a disclosure of abuse?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="concern-childDisclosed"
						value={opt.value}
						bind:group={c.childDisclosed}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Your own observations" inputId="concern-referrerObservations">
		<TextAreaInput
			id="concern-referrerObservations"
			label="Your own observations"
			rows={3}
			placeholder="What you have directly seen or heard."
			bind:value={c.referrerObservations}
		/>
	</Field>
</Fieldset>
