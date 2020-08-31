<script>
	import {currentPath, filePath, explorerContents} from './stores';
	import Explorer from "./Explorer.svelte";
	import ImageViewer from "./ImageViewer.svelte";
	import Settings from "./Settings.svelte";

	$: numLevels = getLevel($currentPath) + 1;
	$: numPartitions = Math.min(4, numLevels + 1);
	$: reqLevels = Array.from(Array(numLevels).keys());

	function getLevel(rPath) {
		if (rPath === '.') return 0;
		else return rPath.split('/').length - 1;
	}
</script>

<div class="app">
	<!-- CPath: {$currentPath} {$currentPathIndex} <br/> -->
	<!-- reqLevels: {reqLevels} -->
	<!-- {@debug $explorerContents} -->
	<div class="explorer">
		<div class="explorerComponents">
			{#each reqLevels as level}
				<Explorer level={level} />
			{/each}
		</div>
		<Settings />
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
		min-height: 250px;
		height: 250px;
	}
	.explorerComponents {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
</style>