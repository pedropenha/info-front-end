<template>
    <div class="catalogo-cursos-view">
        <CatalogoCursos />
    </div>
</template>

<script>
    import CatalogoCursos from '../components/CatalogoCursos.vue' 
    
    export default {
        name: 'CatalogoCursosView',
        components: {
            CatalogoCursos
        }
    }
</script>