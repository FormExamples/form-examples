<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const rf = assessment.data.redFlags;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof rf; label: string; name: string }[] = [
		{
			key: 'stridorOrBreathingDifficulty',
			label: 'Stridor or difficulty breathing?',
			name: 'redFlags-stridorOrBreathingDifficulty'
		},
		{
			key: 'droolingOrCannotSwallow',
			label: 'Drooling or unable to swallow saliva?',
			name: 'redFlags-droolingOrCannotSwallow'
		},
		{ key: 'trismus', label: 'Trismus (cannot open the mouth fully)?', name: 'redFlags-trismus' },
		{
			key: 'muffledVoice',
			label: 'Muffled ("hot-potato") voice?',
			name: 'redFlags-muffledVoice'
		},
		{
			key: 'unilateralNeckSwelling',
			label: 'Unilateral neck swelling?',
			name: 'redFlags-unilateralNeckSwelling'
		}
	];
</script>

<Fieldset legend="Step 7 of 8 — Red-flag review">
	<p class="hint">
		Airway and peritonsillar (quinsy) warning features. Any &quot;Yes&quot; prompts urgent same-day
		assessment irrespective of the Centor / McIsaac score.
	</p>

	{#each questions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={q.name}
							value={opt.value}
							bind:group={rf[q.key]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
