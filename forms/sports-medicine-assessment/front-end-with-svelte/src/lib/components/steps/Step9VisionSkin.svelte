<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.visionSkin;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Vision & Skin">
	<p class="hint">Vision protection and contagious / open skin lesions.</p>

	<Field label="Corrective lenses worn?">
		<RadioGroup label="Corrective lenses worn?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="correctiveLenses" value={opt.value} bind:group={v.correctiveLensesWorn} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Monocular athlete (vision in one eye only)?">
		<RadioGroup label="Monocular athlete?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="monocular" value={opt.value} bind:group={v.monocularAthlete} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Protective eyewear available?">
		<RadioGroup label="Protective eyewear available?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eyewear" value={opt.value} bind:group={v.protectiveEyewearAvailable} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Active skin infection?">
		<RadioGroup label="Active skin infection?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="skinInfection" value={opt.value} bind:group={v.activeSkinInfection} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if v.activeSkinInfection === 'yes'}
		<Field label="Active skin infection details" inputId="activeSkinInfectionDetails">
			<TextAreaInput id="activeSkinInfectionDetails" label="Active skin infection details" rows={2} bind:value={v.activeSkinInfectionDetails} />
		</Field>
	{/if}

	<Field label="Herpes gladiatorum?">
		<RadioGroup label="Herpes gladiatorum?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="herpes" value={opt.value} bind:group={v.herpesGladiatorum} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Impetigo or MRSA lesion?">
		<RadioGroup label="Impetigo or MRSA lesion?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="impetigo" value={opt.value} bind:group={v.impetigoOrMRSA} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Open wounds or weeping lesions?">
		<RadioGroup label="Open wounds or weeping lesions?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="openWounds" value={opt.value} bind:group={v.openWoundsOrLesions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
