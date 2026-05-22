<script lang="ts">
  let {
    label,
    checked = $bindable(false),
  }: {
    label: string;
    checked: boolean;
  } = $props();
</script>

<label class="inline-flex items-start gap-2">
  <input type="checkbox" bind:checked class="mt-1" />
  <span class="text-sm text-slate-700">{label}</span>
</label>
