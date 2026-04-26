<script lang="ts">
	import { T } from '@threlte/core';
</script>

<!-- Simon board placeholder — replaced by full implementation in Issue #7 -->
<T.Group position={[0, 1.2, -4.8]}>
	<T.Mesh>
		<T.BoxGeometry args={[1.5, 1.5, 0.1]} />
		<T.MeshStandardMaterial color="#222222" roughness={0.5} />
	</T.Mesh>
</T.Group>
