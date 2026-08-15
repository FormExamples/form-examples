<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="5. Functional Limitations">
	<p class="hint">Everyday mobility, independent of the Oxford Knee Score questionnaire.</p>

	<Field label="Walking distance before pain" inputId="functional-walkingDistanceBeforePain">
		<Select id="functional-walkingDistanceBeforePain" label="Walking distance before pain" bind:value={d.functional.walkingDistanceBeforePain}>
			<option value="">— Select —</option>
			{#each OPTIONS.walkingDistanceBeforePain as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Stair-climbing ability" inputId="functional-stairClimbingAbility">
		<Select id="functional-stairClimbingAbility" label="Stair-climbing ability" bind:value={d.functional.stairClimbingAbility}>
			<option value="">— Select —</option>
			{#each OPTIONS.stairClimbingAbility as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Can stand from a chair unaided" inputId="functional-standFromChairUnaided">
		<Select id="functional-standFromChairUnaided" label="Can stand from a chair unaided" bind:value={d.functional.standFromChairUnaided}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Walking aid" inputId="functional-walkingAid">
		<Select id="functional-walkingAid" label="Walking aid" bind:value={d.functional.walkingAid}>
			<option value="">— Select —</option>
			{#each OPTIONS.walkingAid as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
