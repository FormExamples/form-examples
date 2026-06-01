<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SuccessPanel from './SuccessPanel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SuccessPanel',
    component: SuccessPanel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SuccessPanel'}}
>
  <span>SuccessPanel</span>
</Story>
