<script lang="ts">
	// CheckboxGroup — Lily Svelte headless contract.
	interface Option {
		value: string;
		label: string;
	}
	let {
		label,
		options,
		values = $bindable([])
	}: {
		label: string;
		options: Option[];
		values: string[];
	} = $props();

	function toggle(val: string) {
		if (values.includes(val)) {
			values = values.filter((v) => v !== val);
		} else {
			values = [...values, val];
		}
	}
</script>

<fieldset class="field checkbox-group" role="group" aria-label={label}>
	<legend class="label">{label}</legend>
	{#each options as opt}
		<label class="checkbox-input" data-checked={values.includes(opt.value) || undefined}>
			<input
				type="checkbox"
				checked={values.includes(opt.value)}
				onchange={() => toggle(opt.value)}
			/>
			<span>{opt.label}</span>
		</label>
	{/each}
</fieldset>
