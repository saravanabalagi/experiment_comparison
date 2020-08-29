<script>
	import {currentPath, filePath, currentPathIndex} from './stores';
	import Explorer from "./Explorer.svelte";
	import ImageViewer from "./ImageViewer.svelte";
	import Settings from "./Settings.svelte";

	$: numLevels = getLevel($currentPath) + 1;
	$: numPartitions = Math.min(4, numLevels + 1);
	$: reqLevels = [-1, ...Array.from(Array(numLevels).keys())];

	function getLevel(rPath) {
		if (rPath === '.') return -1;
		return rPath.split('/').length - 1;
	}
</script>

<div class="app">
<!--	CPath: {$currentPath} {$currentPathIndex}-->
	<Settings />
	<div class="explorer">
		{#each reqLevels as level}
			<Explorer level={level} />
		{/each}
	</div>
	<ImageViewer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.explorer {
		display: flex;
		flex-direction: row;
	}
</style>