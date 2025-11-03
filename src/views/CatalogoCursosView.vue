<template>
    <div class="catalogo-cursos-view">
        <CatalogoCursos />
    </div>
</template>

<script>
    // Caminho relativo para o componente
    import CatalogoCursos from '../components/CatalogoCursos.vue' 
    
    export default {
        name: 'CatalogoCursosView',
        components: {
            CatalogoCursos
        }
    }
</script>