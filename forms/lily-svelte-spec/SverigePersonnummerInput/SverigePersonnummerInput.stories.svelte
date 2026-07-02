<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SverigePersonnummerInput from './SverigePersonnummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SverigePersonnummerInput',
    component: SverigePersonnummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sverige Personnummer Input'}}
/>
