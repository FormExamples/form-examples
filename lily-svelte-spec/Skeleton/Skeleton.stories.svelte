<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Skeleton from './Skeleton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Skeleton',
    component: Skeleton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <div style="width:200px;height:20px"></div>
</Story>
