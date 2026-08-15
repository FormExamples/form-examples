<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const a = $state(assessment.data.anaphylaxisHistory);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	function addEpisode() {
		a.episodes = [...a.episodes, { trigger: '', symptoms: '', treatmentRequired: '' }];
	}

	function removeEpisode(index: number) {
		a.episodes = a.episodes.filter((_, i) => i !== index);
	}
</script>

<Fieldset legend="Anaphylaxis History">
	<p class="hint">Previous anaphylaxis episodes, triggers, and emergency preparedness.</p>

	<Field label="Do you have a history of anaphylaxis?">
		<RadioGroup label="Do you have a history of anaphylaxis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasAnaphylaxis" value={opt.value} bind:group={a.hasAnaphylaxisHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if a.hasAnaphylaxisHistory === 'yes'}
		<Field label="Number of episodes" required inputId="numEpisodes">
			<NumberInput id="numEpisodes" label="Number of episodes" min={1} max={100} bind:value={a.numberOfEpisodes} required />
		</Field>

		<Field label="Episode details">
			<div class="episode-list">
				{#each a.episodes as episode, i (i)}
					<div class="episode-row">
						<div class="episode-fields">
							<input
								type="text"
								class="text-input"
								placeholder="Trigger"
								aria-label="Trigger"
								bind:value={episode.trigger}
							/>
							<input
								type="text"
								class="text-input"
								placeholder="Symptoms"
								aria-label="Symptoms"
								bind:value={episode.symptoms}
							/>
							<input
								type="text"
								class="text-input"
								placeholder="Treatment required"
								aria-label="Treatment required"
								bind:value={episode.treatmentRequired}
							/>
						</div>
						<button
							type="button"
							class="button"
							data-variant="danger"
							onclick={() => removeEpisode(i)}
							aria-label="Remove episode"
						>×</button>
					</div>
				{/each}

				<button
					type="button"
					class="button"
					onclick={addEpisode}
				>+ Add Episode</button>
			</div>
		</Field>

		<Field label="Has an adrenaline auto-injector been prescribed?">
			<RadioGroup label="Adrenaline auto-injector prescribed">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="autoInjector" value={opt.value} bind:group={a.adrenalineAutoInjectorPrescribed} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Is an action plan in place?">
			<RadioGroup label="Action plan in place">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="actionPlan" value={opt.value} bind:group={a.actionPlanInPlace} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.episode-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.episode-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.episode-fields {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.episode-fields { grid-template-columns: 1fr; }
	}
</style>
