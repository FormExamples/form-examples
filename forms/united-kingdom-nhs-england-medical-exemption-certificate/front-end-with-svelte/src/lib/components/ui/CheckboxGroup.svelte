<script lang="ts">
	// CheckboxGroup — Lily Svelte headless contract.
	interface Option {
		value: string;
		label: string;
	}
	let {
		label,
		options,
		values = $bindable([]),
		// Absorb extra attributes (e.g. name, required) so callers can annotate the group.
		...restProps
	}: {
		label: string;
		options: Option[];
		values: string[];
		[key: string]: unknown;
	} = $props();

	function toggle(val: string) {
		if (values.includes(val)) {
			values = values.filter((v) => v !== val);
		} else {
			values = [...values, val];
		}
	}
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<fieldset class="field checkbox-group" role="group" aria-label={label} {...restProps}>
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
