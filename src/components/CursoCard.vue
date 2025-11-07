<template>
    <div class="curso-card">
        <div class="card-body">
            <h3 class="card-title">{{ curso.nome }}</h3>
            <p class="card-subtitle">Instrutor: {{ curso.instrutores }}</p>

            <div class="card-description">
                <p>{{ curso.descricao.substring(0, 150) + '...' }}</p>
            </div>
            
            <div class="card-tags">
                <span class="tag tag-info">{{ curso.local }}</span>
                <span class="tag tag-dark">{{ curso.horario }}</span>
                <span class="tag tag-primary">{{ curso.faixaEtaria }}</span>
            </div>

            <!-- Botão para visualizar detalhes -->
            <button 
                class="btn btn-secondary btn-full-width" 
                @click.stop="$emit('visualizar-detalhes', curso.id || curso._id)">
                Ver Detalhes
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CursoCard',
    props: {
        curso: {
            type: Object,
            required: true,
        },
    },
    emits: ['visualizar-detalhes'],
};
</script>

<style scoped>
/* --- Estilos do CARD (Movemos a maior parte dos estilos do CatalogoCursos.vue para cá) --- */

.curso-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
    height: 100%; 
    display: flex;
    border-bottom: 5px solid var(--color-primary);
    flex-direction: column;
}

.curso-card:hover {
    transform: translateY(-8px) scale(1.01); 
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.card-body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-primary); 
    margin-bottom: 5px;
}

.card-subtitle {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0; 
}

.card-description {
    flex-grow: 1;
    margin-bottom: 15px;
    font-size: 1rem;
    color: var(--color-dark);
}

.card-tags {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex; 
    flex-wrap: wrap;
    gap: 5px; 
}
</style>
