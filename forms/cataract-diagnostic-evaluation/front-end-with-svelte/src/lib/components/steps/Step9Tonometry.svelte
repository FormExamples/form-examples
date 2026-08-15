<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="9. Tonometry">
	<p class="hint">Intraocular pressure above 21 mmHg in either eye raises a high-priority raised-IOP safety flag.</p>

	<Field label="Intraocular pressure — right (mmHg)" inputId="tonometry-intraocularPressureRightMmhg">
		<NumberInput id="tonometry-intraocularPressureRightMmhg" label="Intraocular pressure — right (mmHg)" min={0} max={80} step="1" bind:value={d.tonometry.intraocularPressureRightMmhg} />
	</Field>
	<Field label="Intraocular pressure — left (mmHg)" inputId="tonometry-intraocularPressureLeftMmhg">
		<NumberInput id="tonometry-intraocularPressureLeftMmhg" label="Intraocular pressure — left (mmHg)" min={0} max={80} step="1" bind:value={d.tonometry.intraocularPressureLeftMmhg} />
	</Field>
	<Field label="Tonometry method" inputId="tonometry-tonometryMethod">
		<Select id="tonometry-tonometryMethod" label="Tonometry method" bind:value={d.tonometry.tonometryMethod}>
			<option value="">— Select —</option>
			{#each OPTIONS.tonometryMethod as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
