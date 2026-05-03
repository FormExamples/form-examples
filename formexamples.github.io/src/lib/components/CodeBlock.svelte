<script lang="ts">
  type Props = { children: import('svelte').Snippet };
  let { children }: Props = $props();
</script>

<pre class="my-4 overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900"><code>{@render children()}</code></pre>
