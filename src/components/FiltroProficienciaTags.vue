<template>
    <div class="proficiencia-tag-filter">
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
        
        <div v-if="proficienciasSelecionadas.length > 0" class="tags-list">
            <div 
                v-for="(prof, index) in proficienciasSelecionadas" 
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
</template>

<script>

const normalizarProficiencia = (texto) => {
    if (!texto) return '';
    return texto.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
};

export default {
    name: 'FiltroProficienciaTags',
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        sugestoes: { 
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            novaProficiencia: '',
            proficienciasSelecionadas: [...this.modelValue], 
        };
    },
    computed: {
        sugestoesDisponiveis() {
            // Converte as tags selecionadas para o formato normalizado para comparação
            const selecionadasNormalizadas = this.proficienciasSelecionadas.map(normalizarProficiencia);
            
           return this.sugestoes.filter(tag => { 
           return !selecionadasNormalizadas.includes(normalizarProficiencia(tag));
        });
        }
    },
    watch: {
        proficienciasSelecionadas: {
            deep: true,
            handler(newVal) {
                this.$emit('update:modelValue', newVal);
                this.$emit('filter-changed'); 
            }
        },
        modelValue(newVal) {
            this.proficienciasSelecionadas = newVal;
        }
    },
    methods: {
        adicionarProficiencia() {
            const termoBruto = this.novaProficiencia.trim();
            const termoNormalizado = normalizarProficiencia(termoBruto); 

            if (termoNormalizado && 
                !this.proficienciasSelecionadas.map(normalizarProficiencia).includes(termoNormalizado)
            ) {
                this.proficienciasSelecionadas.push(termoBruto); 
                this.novaProficiencia = '';
            }
        },
        removerProficiencia(index) {
            this.proficienciasSelecionadas.splice(index, 1);
        },
        
        adicionarSugestao(sugestao) {
            const termoNormalizado = normalizarProficiencia(sugestao);
            
            // Verifica novamente se a tag (normalizada) já está na lista
            if (termoNormalizado && 
                !this.proficienciasSelecionadas.map(normalizarProficiencia).includes(termoNormalizado)
            ) {
                // Adiciona a tag no formato BRUTO (para manter a capitalização visual)
                this.proficienciasSelecionadas.push(sugestao);
            }
        }
    },
};
</script>

<style scoped>
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
    background-color: var(--color-light-bg); /* Fundo cinza claro */
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

/* --- ESTILOS EXISTENTES (Mantidos para contexto) --- */
.proficiencia-tag-filter {
    padding: 15px 0;
    width: 100%;
}
.filter-label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--color-dark);
    font-size: 0.9rem;
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
</style>