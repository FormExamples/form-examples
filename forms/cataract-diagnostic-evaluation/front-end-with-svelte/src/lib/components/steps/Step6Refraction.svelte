<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="6. Refraction">
	<p class="hint">Current spectacle prescription, sphere / cylinder / axis, per eye.</p>

	<Field label="Sphere — right" inputId="refraction-refractionSphereRight">
		<NumberInput id="refraction-refractionSphereRight" label="Sphere — right" min={-20} max={20} step="0.25" bind:value={d.refraction.refractionSphereRight} />
	</Field>
	<Field label="Sphere — left" inputId="refraction-refractionSphereLeft">
		<NumberInput id="refraction-refractionSphereLeft" label="Sphere — left" min={-20} max={20} step="0.25" bind:value={d.refraction.refractionSphereLeft} />
	</Field>
	<Field label="Cylinder — right" inputId="refraction-refractionCylinderRight">
		<NumberInput id="refraction-refractionCylinderRight" label="Cylinder — right" min={-10} max={10} step="0.25" bind:value={d.refraction.refractionCylinderRight} />
	</Field>
	<Field label="Cylinder — left" inputId="refraction-refractionCylinderLeft">
		<NumberInput id="refraction-refractionCylinderLeft" label="Cylinder — left" min={-10} max={10} step="0.25" bind:value={d.refraction.refractionCylinderLeft} />
	</Field>
	<Field label="Axis — right" inputId="refraction-refractionAxisRight">
		<NumberInput id="refraction-refractionAxisRight" label="Axis — right" min={0} max={180} step="1" bind:value={d.refraction.refractionAxisRight} />
	</Field>
	<Field label="Axis — left" inputId="refraction-refractionAxisLeft">
		<NumberInput id="refraction-refractionAxisLeft" label="Axis — left" min={0} max={180} step="1" bind:value={d.refraction.refractionAxisLeft} />
	</Field>
	<Field label="Refraction stability" inputId="refraction-refractionStability">
		<Select id="refraction-refractionStability" label="Refraction stability" bind:value={d.refraction.refractionStability}>
			<option value="">— Select —</option>
			{#each OPTIONS.refractionStability as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
