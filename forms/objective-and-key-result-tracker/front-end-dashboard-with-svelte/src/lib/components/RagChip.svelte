<script lang="ts">
  let { value }: { value: 'green' | 'amber' | 'red' } = $props();
  const cls = { green: 'bg-green-700', amber: 'bg-amber-600', red: 'bg-red-700' };
</script>

<span class="inline-block text-white font-bold px-2 py-0.5 rounded text-xs {cls[value]}">{value.toUpperCase()}</span>
