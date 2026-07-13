<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="5. Key Results (1–5)" data-step="5">
	{#each d.keyResults as kr, i (i)}
		<Fieldset legend={`KR ${kr.position}`} data-kr={i}>
			<Field label="Title" inputId={`kr${i}Title`}>
				<TextInput id={`kr${i}Title`} label="Title" bind:value={kr.title} />
			</Field>

			<Field label="Type" inputId={`kr${i}Type`}>
				<Select id={`kr${i}Type`} label="Type" bind:value={kr.krType}>
					<option value="">—</option>
					<option value="numeric">numeric</option>
					<option value="milestone">milestone</option>
					<option value="binary">binary</option>
				</Select>
			</Field>

			<Field label="Start" inputId={`kr${i}Start`}>
				<NumberInput id={`kr${i}Start`} label="Start" step="any" bind:value={kr.startValue} />
			</Field>

			<Field label="Current" inputId={`kr${i}Current`}>
				<NumberInput id={`kr${i}Current`} label="Current" step="any" bind:value={kr.currentValue} />
			</Field>

			<Field label="Target" inputId={`kr${i}Target`}>
				<NumberInput id={`kr${i}Target`} label="Target" step="any" bind:value={kr.targetValue} />
			</Field>

			<Field label="Progress fraction (0–1)" inputId={`kr${i}Progress`}>
				<NumberInput
					id={`kr${i}Progress`}
					label="Progress fraction (0–1)"
					step="any"
					min={0}
					max={1}
					bind:value={kr.progressFraction}
				/>
			</Field>

			<Button data-variant="danger" onclick={() => formState.removeKr(i)}>Remove KR</Button>
		</Fieldset>
	{/each}

	<Button
		data-variant="primary"
		disabled={d.keyResults.length >= 5}
		onclick={() => formState.addKr()}
	>
		Add Key Result
	</Button>
</Fieldset>
