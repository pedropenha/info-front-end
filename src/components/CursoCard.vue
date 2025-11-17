<template>
    <div class="curso-card">
        <div class="card-body">
            <h3 class="card-title">{{ curso.nome }}</h3>
            
            <div class="card-instrutores">
                <span class="label-instrutores">Instrutor(es):</span>
                <div class="instrutores-list">
                    <div 
                        v-for="instrutor in curso.instrutores" 
                        :key="instrutor._id || instrutor"
                        class="instrutor-item"
                    >
                        <img 
                            :src="instrutor.foto || `https://ui-avatars.com/api/?name=${instrutor.nome || 'N/A'}&background=4e9e47&color=fff`" 
                            :alt="instrutor.nome || 'Instrutor'"
                            class="instrutor-avatar"
                        />
                        <span class="instrutor-nome">{{ instrutor.nome || instrutor }}</span>
                    </div>
                </div>
            </div>

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
    margin-bottom: 10px;
}

.card-instrutores {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.label-instrutores {
    font-size: 0.85rem;
    color: #888;
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
}

.instrutores-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.instrutor-item {
    display: flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 4px 10px 4px 4px;
    border-radius: 20px;
    font-size: 0.85rem;
    transition: all 0.2s ease;
}

.instrutor-item:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    transform: scale(1.02);
}

.instrutor-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-primary);
}

.instrutor-nome {
    color: #495057;
    font-weight: 500;
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
