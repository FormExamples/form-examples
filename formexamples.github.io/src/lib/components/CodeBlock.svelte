<script lang="ts">
  type Props = { children: import('svelte').Snippet };
  let { children }: Props = $props();
</script>

<pre class="my-4 overflow-x-auto rounded-md border border-base-300 bg-base-200 p-4 font-mono text-sm leading-relaxed"><code>{@render children()}</code></pre>
