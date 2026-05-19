<script lang="ts" generics="T extends string">
  interface Option {
    value: T;
    label: string;
  }

  let {
    id,
    name,
    options,
    value = $bindable(),
  }: {
    id: string;
    name: string;
    options: Option[];
    value: T;
  } = $props();
</script>

<div {id} class="flex flex-wrap gap-3" role="radiogroup">
  {#each options as opt (opt.value)}
    <label class="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-slate-50">
      <input
        type="radio"
        {name}
        value={opt.value}
        checked={value === opt.value}
        onchange={() => (value = opt.value)}
        class="text-brand-600"
      />
      <span class="text-sm">{opt.label}</span>
    </label>
  {/each}
</div>
