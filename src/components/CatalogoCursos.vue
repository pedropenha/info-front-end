<template>
    <div class="catalogo-cursos section">
        <div class="main-container">
            <h1 class="title-h1">Explore Nossos Cursos e Eventos</h1>
            
            <FiltroCursos
                v-model:buscaTermo="buscaTermo"
                v-model:filtroLocal="filtroLocal"
                v-model:filtroFaixaEtaria="filtroFaixaEtaria"
                v-model:filtroHorario="filtroHorario"
                v-model:filtroProficiencia="filtroProficiencia"
                @limpar-filtros="limparFiltros"
            />

            <div v-if="carregando" class="status-message loading">
                Carregando cursos...
            </div>
            <div v-else-if="erro" class="status-message error-box">
                Erro ao carregar os cursos. Tente novamente mais tarde.
            </div>
            <div v-else-if="cursos.length === 0" class="status-message warning-box">
                Nenhum curso encontrado com os critérios de busca.
            </div>

            <div v-else>
                <div class="cursos-grid-container">
                    <TransitionGroup name="list" tag="div" class="cursos-grid-transition">
                        <CursoCard
                            v-for="curso in cursos" 
                            :key="curso.id" 
                            :curso="curso"
                            @visualizar-detalhes="visualizarDetalhes"
                        />
                    </TransitionGroup>
                </div>
            
                <div v-if="totalPaginas > 1" class="paginacao-wrapper">
                    <button 
                        class="btn btn-light" 
                        @click="mudarPagina(paginaAtual - 1)" 
                        :disabled="paginaAtual === 1">
                        Anterior
                    </button>
                    
                    <span class="paginacao-info">
                        Página {{ paginaAtual }} de {{ totalPaginas }} (Total de Cursos: {{ totalCursos }})
                    </span>

                    <button 
                        class="btn btn-light" 
                        @click="mudarPagina(paginaAtual + 1)" 
                        :disabled="paginaAtual === totalPaginas">
                        Próxima
                    </button>
                </div>
            </div>
            </div>
    </div>
</template>

<script>
import axios from 'axios'; 
import debounce from 'lodash/debounce'; 

import FiltroCursos from './FiltroCursos.vue'; 
import CursoCard from './CursoCard.vue'; 

export default {
    name: "CatalogoCursosView", 
    components: {
        FiltroCursos,
        CursoCard,
    },
    data() {
        return {
            cursos: [], 
            
            // ESTADOS DE FILTRO (Busca Unificada e Filtros Dedicados)
            buscaTermo: '', // Usado para buscar Curso, Instrutor, Tecnologia
            filtroLocal: '', 
            filtroFaixaEtaria: '', 
            filtroHorario: '', 
            
            // ESTADOS DE PAGINAÇÃO:
            paginaAtual: 1,
            limitePorPagina: 9, 
            totalPaginas: 0,
            totalCursos: 0,

            carregando: false,
            erro: null,
            API_BASE_URL: 'http://localhost:3000/api/cursos', 
        };
    },
    created() {
        this.buscarCursos();
        // Cria a versão debounced (300ms de espera)
        this.buscarCursosDebounced = debounce(this.buscarCursos, 300);
    },
    watch: {
        // Monitora mudanças no termo de busca unificada
        buscaTermo() { 
            this.paginaAtual = 1; 
            this.buscarCursosDebounced(); 
        },
        // Monitora filtros de seleção imediata
        filtroLocal() { 
            this.paginaAtual = 1; 
            this.buscarCursos(); 
        },
        filtroFaixaEtaria() { 
            this.paginaAtual = 1; 
            this.buscarCursos(); 
        },
        filtroHorario() { 
            this.paginaAtual = 1; 
            this.buscarCursos(); 
        },
        // Removemos os watches de filtroProficiencia e filtroInstrutor
    },
    methods: {
        async buscarCursos() {
            this.carregando = true;
            this.erro = null;
            
            const params = new URLSearchParams();
            
            // ADICIONA O TERMO DE BUSCA UNIFICADO
            if (this.buscaTermo) { 
                params.append('busca', this.buscaTermo); 
            }
            
            // Adiciona filtros dedicados
            if (this.filtroLocal) { params.append('local', this.filtroLocal); }
            if (this.filtroFaixaEtaria) { params.append('faixaEtaria', this.filtroFaixaEtaria); }
            if (this.filtroHorario) { params.append('horario', this.filtroHorario); }

            // Adiciona PAGINAÇÃO
            params.append('page', this.paginaAtual);
            params.append('limit', this.limitePorPagina);

            const url = `${this.API_BASE_URL}?${params.toString()}`;

            try {
                const response = await axios.get(url);
                
                const data = response.data || {};
                
                this.cursos = data.cursos || []; 
                this.totalCursos = data.total || 0;
                this.totalPaginas = data.totalPaginas || 0;
                this.paginaAtual = data.pagina || 1;
            
            } catch (err) {
                console.error("Erro ao buscar cursos:", err);
                this.erro = "Não foi possível conectar ao servidor ou buscar os cursos.";
                this.cursos = []; 
                this.totalCursos = 0;
                this.totalPaginas = 0;
            } finally {
                this.carregando = false;
            }
        },

        limparFiltros() {
            this.buscaTermo = '';
            this.filtroLocal = '';
            this.filtroFaixaEtaria = '';
            this.filtroHorario = '';
            this.paginaAtual = 1; 
            this.buscarCursos(); 
        },

        mudarPagina(novaPagina) {
            if (novaPagina > 0 && novaPagina <= this.totalPaginas) {
                this.paginaAtual = novaPagina;
                this.buscarCursos();
            }
        },

        visualizarDetalhes(cursoId) {
            this.$router.push(`/cursos/${cursoId}`); 
        }
    },
};
</script>
<style scoped>
/* --- Estilos da Paginação --- */
.paginacao-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    padding: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.paginacao-info {
    font-size: 1rem;
    color: var(--color-dark);
}

/* --- Layout e Container --- */
.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.title-h1 {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--color-dark);
    margin-bottom: 2rem;
}

/* --- GRID RESPONSIVO PARA OS CARDS (NOVO CONTAINER DE TRANSITION) --- */
.cursos-grid-transition {
    display: grid;
    gap: 25px; 
    grid-template-columns: 1fr; 
}

@media (min-width: 768px) {
    .cursos-grid-transition {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .cursos-grid-transition {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* --- Estilos de Transição (Animação Fluida de Entrada/Saída) --- */

.list-enter-from, .list-leave-to { 
    opacity: 0; 
    transform: translateY(30px); 
}
.list-enter-active { 
    transition: all 0.4s ease-out; 
}
.list-leave-active { 
    position: absolute; /* Necessário para animar itens de saída corretamente no grid */
    transition: all 0.4s ease-in; 
}
.list-move { 
    transition: transform 0.5s; 
}

/* --- Status Messages --- */
.status-message { 
    padding: 15px; 
    border-radius: 8px; 
    margin-top: 20px; 
    font-weight: bold; 
    text-align: center; 
}
.error-box { 
    background-color: #fce8e8; 
    color: #cc0000; 
    border: 1px solid #cc0000; 
}
.warning-box { 
    background-color: #fff4e0; 
    color: #cc9900; 
    border: 1px solid #cc9900; 
}



</style>