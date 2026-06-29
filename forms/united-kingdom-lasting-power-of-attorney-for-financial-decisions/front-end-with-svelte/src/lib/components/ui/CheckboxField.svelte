<script lang="ts">
  // CheckboxField — Lily Svelte headless contract (checkbox-input).
  let {
    label,
    checked = $bindable(false),
  }: {
    label: string;
    checked: boolean;
  } = $props();
</script>

<label class="checkbox-input">
  <input type="checkbox" bind:checked />
  <span>{label}</span>
</label>
