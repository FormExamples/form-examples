<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AlbaCommunityHealthIndexInput from './AlbaCommunityHealthIndexInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AlbaCommunityHealthIndexInput',
    component: AlbaCommunityHealthIndexInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Alba Community Health Index Input'}}
/>
