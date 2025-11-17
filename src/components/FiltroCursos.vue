<template>
    <div class="filtros-wrapper">
        <div class="filtros-header">
            <h3 class="filtros-titulo">Filtros de Busca</h3>
            <button class="btn-toggle" @click="filtrosExpandidos = !filtrosExpandidos" type="button" :title="filtrosExpandidos ? 'Minimizar' : 'Expandir'">
                <svg v-if="filtrosExpandidos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 8V16M12 8L15 11M12 8L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 16V8M12 16L15 13M12 16L9 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <div v-show="filtrosExpandidos" class="filtros-content">
        <div class="filtros-principais">
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
        </div>

        <div class="proficiencia-section">
            <label class="filter-label">Proficiências Requeridas:</label>
            
            <div class="sugestoes-wrapper">
                <span class="sugestao-titulo">Sugestões:</span>
                <div class="sugestoes-chips">
                    <button 
                        v-for="sugestao in sugestoesDisponiveis" 
                        :key="sugestao" 
                        @click="adicionarSugestao(sugestao)"
                        class="btn-sugestao"
                        type="button"
                    >
                        {{ sugestao }}
                    </button>
                </div>
            </div>

            <div class="input-tag-group">
                <input 
                    v-model="novaProficiencia"
                    @keypress.enter.prevent="adicionarProficiencia"
                    type="text"
                    class="input-search input-tag-text"
                    placeholder="Ex: Node.js, Figma, SQL (Pressione Enter)"
                />
                <button 
                    type="button" 
                    @click="adicionarProficiencia" 
                    class="btn btn-primary btn-add-tag"
                    :disabled="!novaProficiencia.trim()"
                >
                    +
                </button>
            </div>
            
            <div v-if="proficienciasSelecionadasInternas.length > 0" class="tags-list">
                <div 
                    v-for="(prof, index) in proficienciasSelecionadasInternas" 
                    :key="prof" 
                    class="tag tag-chip"
                >
                    <span>{{ prof }}</span>
                    <button 
                        type="button" 
                        class="btn-remove-chip"
                        @click="removerProficiencia(index)"
                        aria-label="Remover proficiência"
                    >
                        &times;
                    </button>
                </div>
            </div>
            <small v-else class="filter-hint">Adicione tags para refinar a busca.</small>
        </div>

        <div class="botoes-acao">
            <button class="btn btn-primary" @click="aplicarFiltros">
                Aplicar Filtros
            </button>
            <button class="btn btn-light" @click="limparFiltros">
                Limpar Filtros
            </button>
        </div>
        </div>

        <!-- Filtros Ativos -->
        <div v-if="filtrosAtivos.length > 0" class="filtros-ativos-section">
            <span class="filtros-ativos-titulo">Filtros Ativos:</span>
            <div class="filtros-ativos-badges">
                <span v-for="(filtro, index) in filtrosAtivos" :key="index" class="badge-filtro">
                    {{ filtro.label }}: <strong>{{ filtro.value }}</strong>
                    <button type="button" class="btn-remover-badge" @click="removerFiltroAtivo(filtro.tipo)" aria-label="Remover filtro">
                        &times;
                    </button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
const normalizarProficiencia = (texto) => {
    if (!texto) return '';
    return texto.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
};

export default {
    name: 'FiltroCursos',
    props: {
        buscaTermo: { type: String, default: '' },
        filtroLocal: { type: String, default: '' },
        filtroFaixaEtaria: { type: String, default: '' }, 
        filtroHorario: { type: String, default: '' },
        filtroStatus: { type: String, default: '' },
        proficienciasSelecionadas: { type: Array, default: () => [] },
        sugestoes: { type: Array, default: () => [] },
    },
    data() {
        return {
            novaProficiencia: '',
            proficienciasSelecionadasInternas: [...this.proficienciasSelecionadas],
            filtrosExpandidos: true,
        };
    },
    computed: {
        sugestoesDisponiveis() {
            const selecionadasNormalizadas = this.proficienciasSelecionadasInternas.map(normalizarProficiencia);
            return this.sugestoes.filter(tag => {
                return !selecionadasNormalizadas.includes(normalizarProficiencia(tag));
            });
        },
        filtrosAtivos() {
            const ativos = [];
            
            if (this.buscaTermo) {
                ativos.push({ tipo: 'busca', label: 'Busca', value: this.buscaTermo });
            }
            if (this.filtroLocal) {
                ativos.push({ tipo: 'local', label: 'Localização', value: this.filtroLocal });
            }
            if (this.filtroFaixaEtaria) {
                ativos.push({ tipo: 'faixaEtaria', label: 'Faixa Etária', value: this.filtroFaixaEtaria });
            }
            if (this.filtroHorario) {
                ativos.push({ tipo: 'horario', label: 'Horário', value: this.filtroHorario });
            }
            if (this.filtroStatus) {
                ativos.push({ tipo: 'status', label: 'Status', value: this.filtroStatus });
            }
            if (this.proficienciasSelecionadas.length > 0) {
                ativos.push({ 
                    tipo: 'proficiencias', 
                    label: 'Proficiências', 
                    value: this.proficienciasSelecionadas.join(', ') 
                });
            }
            
            return ativos;
        }
    },
    watch: {
        proficienciasSelecionadas(newVal) {
            this.proficienciasSelecionadasInternas = [...newVal];
        }
    },
    emits: [
        'update:buscaTermo', 
        'update:filtroLocal',
        'update:filtroFaixaEtaria', 
        'update:filtroHorario',
        'update:filtroStatus',
        'update:proficienciasSelecionadas',
        'aplicar-filtros',
        'limpar-filtros'
    ],
    methods: {
        adicionarProficiencia() {
            const termoBruto = this.novaProficiencia.trim();
            const termoNormalizado = normalizarProficiencia(termoBruto);

            if (termoNormalizado && 
                !this.proficienciasSelecionadasInternas.map(normalizarProficiencia).includes(termoNormalizado)
            ) {
                this.proficienciasSelecionadasInternas.push(termoBruto);
                this.novaProficiencia = '';
            }
        },
        removerProficiencia(index) {
            this.proficienciasSelecionadasInternas.splice(index, 1);
        },
        adicionarSugestao(sugestao) {
            const termoNormalizado = normalizarProficiencia(sugestao);
            
            if (termoNormalizado && 
                !this.proficienciasSelecionadasInternas.map(normalizarProficiencia).includes(termoNormalizado)
            ) {
                this.proficienciasSelecionadasInternas.push(sugestao);
            }
        },
        aplicarFiltros() {
            this.$emit('update:proficienciasSelecionadas', this.proficienciasSelecionadasInternas);
            this.$emit('aplicar-filtros');
        },
        limparFiltros() {
            this.proficienciasSelecionadasInternas = [];
            this.novaProficiencia = '';
            this.$emit('limpar-filtros');
        },
        removerFiltroAtivo(tipo) {
            switch(tipo) {
                case 'busca':
                    this.$emit('update:buscaTermo', '');
                    break;
                case 'local':
                    this.$emit('update:filtroLocal', '');
                    break;
                case 'faixaEtaria':
                    this.$emit('update:filtroFaixaEtaria', '');
                    break;
                case 'horario':
                    this.$emit('update:filtroHorario', '');
                    break;
                case 'status':
                    this.$emit('update:filtroStatus', '');
                    break;
                case 'proficiencias':
                    this.proficienciasSelecionadasInternas = [];
                    this.$emit('update:proficienciasSelecionadas', []);
                    break;
            }
            this.$emit('aplicar-filtros');
        }
    },
};
</script>

<style scoped>
.filtros-wrapper {
    padding: 20px;
    background-color: white; 
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.filtros-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e5e5e5;
}

.filtros-titulo {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-dark);
}

.btn-toggle {
    background-color: var(--color-primary);
    color: white;
    border: 2px solid var(--color-primary);
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, color 0.3s;
}

.btn-toggle:hover {
    background-color: white;
    color: var(--color-primary);
}

.btn-toggle svg {
    display: block;
}

.filtros-content {
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.filtros-principais {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
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

.proficiencia-section {
    padding: 15px 0;
    border-top: 1px solid #e5e5e5;
    margin-top: 10px;
}

.filter-label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--color-dark);
    font-size: 0.9rem;
}

.sugestoes-wrapper {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e0e0e0;
}

.sugestao-titulo {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-dark);
    margin-right: 10px;
    display: inline-block;
    margin-bottom: 5px;
}

.sugestoes-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.btn-sugestao {
    background-color: var(--color-light-bg);
    color: #444; 
    border: 1px solid #dcdcdc;
    padding: 6px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s, border-color 0.2s;
}

.btn-sugestao:hover {
    background-color: #e5e5e5;
    border-color: #c4c4c4;
}

.input-tag-group {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.input-tag-text {
    flex-grow: 1;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag-chip {
    display: inline-flex;
    align-items: center;
    background-color: var(--color-primary);
    color: white;
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
}

.btn-add-tag {
    padding: 10px 15px;
    line-height: 1;
    font-weight: 700;
    font-size: 1.2rem;
}

.btn-remove-chip {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: 8px;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.btn-remove-chip:hover {
    opacity: 1;
}

.filter-hint {
    font-size: 0.8rem;
    color: #888;
}

.botoes-acao {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e5e5e5;
}

.btn-light, .btn-primary {
    border-radius: 50px;
    padding: 12px 24px;
    font-weight: 600;
}

.filtros-ativos-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid #e5e5e5;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}

.filtros-ativos-titulo {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-dark);
}

.filtros-ativos-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.badge-filtro {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    color: #333;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    border: 1px solid #d0d0d0;
}

.badge-filtro strong {
    margin-left: 4px;
    color: var(--color-primary);
}

.btn-remover-badge {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    margin-left: 8px;
    font-weight: bold;
    font-size: 1.2rem;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
}

.btn-remover-badge:hover {
    color: #cc0000;
}

@media (max-width: 600px) {
    .select-filter {
        min-width: 48%;
    }
    
    .botoes-acao {
        flex-direction: column;
    }
    
    .botoes-acao button {
        width: 100%;
    }
}
</style>