<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="5. Functional Limitations">
	<p class="hint">Everyday function beyond the Oxford Hip Score's own items.</p>

	<Field label="Walking distance before pain forces a stop" inputId="function-walkingDistanceBeforePain">
		<Select id="function-walkingDistanceBeforePain" label="Walking distance before pain forces a stop" bind:value={d.function.walkingDistanceBeforePain}>
			<option value="">— Select —</option>
			{#each OPTIONS.walkingDistanceBeforePain as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Shoes and socks difficulty" inputId="function-shoesAndSocksDifficulty">
		<Select id="function-shoesAndSocksDifficulty" label="Shoes and socks difficulty" bind:value={d.function.shoesAndSocksDifficulty}>
			<option value="">— Select —</option>
			{#each OPTIONS.shoesAndSocksDifficulty as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Walking aid in use" inputId="function-walkingAidUse">
		<Select id="function-walkingAidUse" label="Walking aid in use" bind:value={d.function.walkingAidUse}>
			<option value="">— Select —</option>
			{#each OPTIONS.walkingAidUse as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
