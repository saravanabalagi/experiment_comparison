<script>
	import { filePath, currentPath, explorerContents } from "./stores";
	import { allowedExtensions, operationMode, operationModes } from "./stores";
	import * as path from 'path';
	export let level;

	let cPath, currentPathTokens, shouldLoad = false;
	$: {
		currentPathTokens = $currentPath.split('/');
		cPath = currentPathTokens.slice(0, level+1).join('/'); // Current Path of this Component
		shouldLoad = level === 0 || (level > 0 && getFiles($explorerContents, level-1).map(f => f.name).includes(currentPathTokens[level]));
	}

	let files, selectedIndex, selectedFileName;
	$: if (files != null && selectedIndex != null && $operationMode === operationModes.index) {
		selectedFileName = files[selectedIndex].name;
		if (files[selectedIndex].directory) {
			if (currentPathTokens[level + 1] !== selectedFileName)
				setSelectedFolder(selectedIndex);
		} else {
			if ($filePath != null && selectedFileName !== path.basename($filePath))
				setSelectedFile(selectedIndex);
		}
	}

	$: if(files != null && selectedFileName != null && $operationMode === operationModes.name) {
		const reqFiles = files.filter(f => f.name === selectedFileName);
		if (reqFiles.length > 0) {
			const reqFile = reqFiles[0];
			if(reqFile.directory) setSelectedFolder(reqFile.index);
			else setSelectedFile(reqFile.index);
		}
	}

	function setSelectedFolder(i) {
		const file = files[i];
		selectedIndex = i;
		selectedFileName = files[selectedIndex].name;
		const pathTokens = [...currentPathTokens];
		pathTokens[level+1] = file.name;
		currentPath.set(pathTokens.join('/'));
		explorerContents.update(e => { e[level].selected = {name: selectedFileName, index: selectedIndex}; return e;});
	}

	function setSelectedFile(i) {
		const file = files[i];
		selectedIndex = i;
		selectedFileName = files[selectedIndex].name;
		currentPath.set(cPath);
		explorerContents.update(e => { e[level].selected = {name: selectedFileName, index: selectedIndex}; return e;});
		filePath.set(path.join(cPath, file.name));
	}

	const getFiles = (explorerContents, level, fetchKey) => {
		if(fetchKey == null) fetchKey = 'files';
		if(explorerContents &&
			explorerContents[level] &&
			explorerContents[level][fetchKey])
			return explorerContents[level][fetchKey];
		return [];
	}

	$: promise = fetchFiles(cPath);
	async function fetchFiles(rPath) {
		if(!shouldLoad) return;
		explorerContents.update(e => ({...e, [level]: {files: [], path: rPath}}));
		const pathStr = `?path=${rPath}`
		const url = `/files${pathStr}`;
		const response = await fetch(url);
		if(response.ok) {
			const responseJson = await response.json();
			files = responseJson.map((e,i) => ({...e, index: i}));
			explorerContents.update(e => ({...e, [level]: {files, path: rPath}}));
			shouldLoad = false;
			return files;
		} else console.log(Error(await response.text()));
	}

</script>

<div class="explorer">
	<!-- cPath: {cPath} <br/> -->
	<!-- Selected: {selectedFileName} {level} -->
	{#each getFiles($explorerContents, level) as file, i}
		{#if file.directory}
			<div class="explorerContent directory" class:active="{file.name === selectedFileName}"
				on:click={() => setSelectedFolder(i)}> {file.name} </div>
		{:else if allowedExtensions.some(e => file.name.endsWith(e))}
			<div class="explorerContent file" class:active="{file.name === selectedFileName}"
				on:click={() => setSelectedFile(i)}> {file.name} </div>
		{/if}
	{/each}
</div>

<style>
	.explorerContent {
		padding: 0 10px;
	}
	.active {
		background-color: #ccc;
	}
</style>