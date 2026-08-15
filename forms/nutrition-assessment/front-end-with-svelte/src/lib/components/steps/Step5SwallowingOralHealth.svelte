<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.swallowingOralHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Swallowing & Oral Health">
	<p class="hint">Difficulties with swallowing, chewing, or oral health that may limit intake.</p>

	<Field label="Do you have any difficulty swallowing?">
		<RadioGroup label="Difficulty swallowing">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="swallowingDifficulty" value={opt.value} bind:group={s.swallowingDifficulty} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Do you cough while eating or drinking?">
		<RadioGroup label="Coughing while eating">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="coughingWhileEating" value={opt.value} bind:group={s.coughingWhileEating} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Have you had episodes of choking?">
		<RadioGroup label="Choking episodes">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chokingEpisodes" value={opt.value} bind:group={s.chokingEpisodes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you wear dentures?">
		<RadioGroup label="Denture use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dentureUse" value={opt.value} bind:group={s.dentureUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.dentureUse === 'yes'}
		<Field label="Do your dentures fit well?">
			<RadioGroup label="Dentures fit well">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="denturesFitWell" value={opt.value} bind:group={s.denturesFitWell} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Do you have dental pain?">
		<RadioGroup label="Dental pain">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dentalPain" value={opt.value} bind:group={s.dentalPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Do you have mouth sores or ulcers?">
		<RadioGroup label="Mouth sores">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mouthSores" value={opt.value} bind:group={s.mouthSores} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Do you have a dry mouth?">
		<RadioGroup label="Dry mouth">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dryMouth" value={opt.value} bind:group={s.dryMouth} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Have you noticed taste changes?">
		<RadioGroup label="Taste changes">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tasteChanges" value={opt.value} bind:group={s.tasteChanges} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional swallowing or oral-health notes" inputId="swallowingNotes">
		<TextAreaInput id="swallowingNotes" label="Swallowing notes" rows={3} bind:value={s.swallowingNotes} />
	</Field>
</Fieldset>
