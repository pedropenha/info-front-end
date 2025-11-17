<template>
    <div class="filtros-wrapper">
        
        <input 
            class="input-search" 
            type="text" 
            :value="buscaTermo" 
            @input="$emit('update:buscaTermo', $event.target.value)" 
            placeholder="Buscar curso ou instrutor..."
        />
        
        <div class="select-wrapper select-local">
            <select :value="filtroLocal" @change="$emit('update:filtroLocal', $event.target.value)" class="select-filter">
                <option value="">Localização (Todos)</option>
                <option value="Online">Online</option>
                <option value="Presencial">Presencial</option>
            </select>
        </div>

        <div class="select-wrapper">
            <select :value="filtroFaixaEtaria" @change="$emit('update:filtroFaixaEtaria', $event.target.value)" class="select-filter">
                <option value="">Faixa Etária (Todas)</option>
                <option value="Livre">Livre</option>
                <option value="16+">A partir de 16+</option>
                <option value="18+">A partir de 18+</option>
            </select>
        </div>
        
        <div class="select-wrapper">
            <select :value="filtroHorario" @change="$emit('update:filtroHorario', $event.target.value)" class="select-filter">
                <option value="">Horário (Todos)</option>
                <option value="Noturno">Noturno</option>
                <option value="Diurno">Diurno</option>
                <option value="Fim de Semana">Fim de Semana</option>
            </select>
        </div>

        <div class="select-wrapper">
            <select :value="filtroStatus" @change="$emit('update:filtroStatus', $event.target.value)" class="select-filter">
                <option value="">Status (Ativos)</option>
                <option value="Ativo">Ativo</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
            </select>
        </div>

        <button class="btn btn-light" @click="$emit('limpar-filtros')">
            Limpar Filtros
        </button>
    </div>
</template>

<script>
export default {
    name: 'FiltroCursos',
    props: {
        buscaTermo: { type: String, default: '' },
        filtroLocal: { type: String, default: '' },
        filtroFaixaEtaria: { type: String, default: '' }, 
        filtroHorario: { type: String, default: '' },
        filtroStatus: { type: String, default: '' },
    },
    emits: [
        'update:buscaTermo', 
        'update:filtroLocal',
        'update:filtroFaixaEtaria', 
        'update:filtroHorario',
        'update:filtroStatus',
        'limpar-filtros'
    ],
};
</script>

<style scoped>
.filtros-wrapper {
    display: flex;
    gap: 12px; 
    padding: 20px;
    background-color: white; 
    border-radius: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.input-search, .select-filter {
    flex-grow: 1;
    min-width: 150px; 
    padding: 12px 15px;
    border-radius: 8px;
    
    background-color: #f7f7f7; 
    border: 1px solid #e5e5e5;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.04);
    
    transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
}

.select-filter {
    border-radius: 50px; 
    background-color: white; 
    border: 1px solid var(--color-primary); 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); 
    
    appearance: none; 
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
}

.input-search:focus, .select-filter:focus {
    outline: none;
    border-color: var(--color-primary); 
    box-shadow: 0 0 0 3px rgba(78, 158, 71, 0.2); 
    background-color: white;
}

.select-wrapper {
    min-width: 180px;
    flex-grow: 0.5;
    position: relative;
}

.btn-light {
    border-radius: 50px; 
}

@media (max-width: 600px) {
    .select-filter {
        min-width: 48%;
    }
}
</style>