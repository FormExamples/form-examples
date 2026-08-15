<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { SPAQ_OPTIONS } from '#lib/engine/sad-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.socialOccupational;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Social & Occupational Impact">
	<p class="hint">SPAQ seasonality items for mood and social activity (scored 0-4), plus impairment.</p>

	<Field label="Mood (general well-being) — how much does it change with the seasons?">
		<RadioGroup label="Mood seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqMood"
						value={opt.value}
						bind:group={s.spaq.mood}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Social activity — how much do the seasons change your level of social activity?">
		<RadioGroup label="Social activity seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqSocialActivity"
						value={opt.value}
						bind:group={s.spaq.socialActivity}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Work / study performance impaired?">
		<RadioGroup label="Work impaired">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="workImpaired" value={opt.value} bind:group={s.workImpaired} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Relationships impaired by symptoms?">
		<RadioGroup label="Relationships impaired">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="relationshipsImpaired" value={opt.value} bind:group={s.relationshipsImpaired} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Social withdrawal?">
		<RadioGroup label="Social withdrawal">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="socialWithdrawal" value={opt.value} bind:group={s.socialWithdrawal} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Occupational notes" inputId="occupationalNotes">
		<TextAreaInput id="occupationalNotes" label="Occupational notes" rows={3} bind:value={s.occupationalNotes} />
	</Field>
</Fieldset>
