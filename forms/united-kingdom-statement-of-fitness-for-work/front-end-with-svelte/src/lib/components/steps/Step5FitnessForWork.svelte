<script lang="ts">
	import { store } from '$lib/stores/fitnote.svelte';
	import type { FitnessForWork } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = store.data;

	const options: { value: FitnessForWork; label: string }[] = [
		{ value: 'not_fit', label: 'You are not fit for work' },
		{
			value: 'may_be_fit',
			label: 'You may be fit for work taking account of the following advice'
		}
	];
</script>

<Fieldset legend="Fitness for work">
	<p class="hint">
		DWP policy 3.2: a fit note cannot certify a patient as "fit for work" — only "not fit" or
		"may be fit" with adaptations advice.
	</p>

	<Field label="Fitness for work" required>
		<RadioGroup label="Fitness for work">
			{#each options as opt (opt.value)}
				<label class="radio-option">
					<input
						type="radio"
						class="radio-input"
						name="fitnessForWork"
						value={opt.value}
						bind:group={d.fitnessForWork}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
