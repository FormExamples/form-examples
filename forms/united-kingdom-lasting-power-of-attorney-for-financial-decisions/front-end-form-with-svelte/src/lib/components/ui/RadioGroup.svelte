<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }
  let {
    name,
    options,
    value = $bindable(''),
  }: {
    name: string;
    options: Option[];
    value: string;
  } = $props();
</script>

<div class="flex flex-col gap-1">
  {#each options as opt (opt.value)}
    <label class="inline-flex items-start gap-2">
      <input
        type="radio"
        {name}
        value={opt.value}
        checked={value === opt.value}
        onchange={() => (value = opt.value)}
        class="mt-1"
      />
      <span class="text-sm text-slate-700">{opt.label}</span>
    </label>
  {/each}
</div>
