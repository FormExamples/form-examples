<script lang="ts">
	// Checkbox — Lily Svelte headless contract.
	let {
		label,
		name,
		checked = $bindable(false)
	}: {
		label: string;
		name: string;
		checked: boolean;
	} = $props();
</script>

<div class="field">
	<div class="checkbox-group" role="group" aria-label={label}>
		<label>
			<input
				id={name}
				{name}
				type="checkbox"
				class="checkbox-input"
				bind:checked
			/>
			<span>{label}</span>
		</label>
	</div>
</div>
