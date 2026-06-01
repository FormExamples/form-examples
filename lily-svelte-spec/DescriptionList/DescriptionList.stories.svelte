<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DescriptionList from './DescriptionList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DescriptionList',
    component: DescriptionList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DescriptionList'}}
>
  <span>DescriptionList</span>
</Story>
