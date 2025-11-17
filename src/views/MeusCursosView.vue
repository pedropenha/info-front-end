<template>
    <div class="meus-cursos-page">
        <div class="meus-cursos-container">
            <h1 class="page-title">Meus Cursos</h1>

            
            <div class="filtros-container">
                <button 
                    @click="filtroAtivo = 'todos'"
                    :class="['filtro-btn', { 'ativo': filtroAtivo === 'todos' }]"
                >
                    <iconify-icon icon="hugeicons:book-02" width="20" height="20"></iconify-icon>
                    Todos ({{ cursosCount.todos }})
                </button>
                <button 
                    @click="filtroAtivo = 'em_andamento'"
                    :class="['filtro-btn', { 'ativo': filtroAtivo === 'em_andamento' }]"
                >
                    <iconify-icon icon="hugeicons:loading-03" width="20" height="20"></iconify-icon>
                    Em Andamento ({{ cursosCount.em_andamento }})
                </button>
                <button 
                    @click="filtroAtivo = 'vai_iniciar'"
                    :class="['filtro-btn', { 'ativo': filtroAtivo === 'vai_iniciar' }]"
                >
                    <iconify-icon icon="hugeicons:clock-01" width="20" height="20"></iconify-icon>
                    Vai Iniciar ({{ cursosCount.vai_iniciar }})
                </button>
                <button 
                    @click="filtroAtivo = 'concluido'"
                    :class="['filtro-btn', { 'ativo': filtroAtivo === 'concluido' }]"
                >
                    <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                    Concluídos ({{ cursosCount.concluido }})
                </button>
            </div>

            
            <div v-if="loading" class="loading-message">
                <iconify-icon icon="hugeicons:loading-03" width="48" height="48" class="rotating"></iconify-icon>
                <p>Carregando seus cursos...</p>
            </div>

            
            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>

           
            <div v-else-if="cursosFiltrados.length === 0" class="empty-state">
                <iconify-icon icon="hugeicons:folder-open" width="80" height="80"></iconify-icon>
                <h3>Nenhum curso encontrado</h3>
                <p v-if="filtroAtivo === 'todos'">Você ainda não está inscrito em nenhum curso.</p>
                <p v-else>Não há cursos {{ filtroAtivo.replace('_', ' ') }}.</p>
                <router-link to="/cursos" class="btn-primary">
                    <iconify-icon icon="hugeicons:search-01" width="20" height="20"></iconify-icon>
                    Explorar Cursos
                </router-link>
            </div>

            
            <div v-else class="cursos-grid">
                <div 
                    v-for="inscricao in cursosFiltrados" 
                    :key="inscricao._id"
                    class="curso-card"
                >
                    
                    <div class="status-badges">
                        <span :class="['badge', `badge-${inscricao.statusCurso}`]">
                            {{ getStatusLabel(inscricao.statusCurso) }}
                        </span>
                        <span 
                            v-if="inscricao.cursoId.concluido" 
                            class="badge badge-curso-concluido"
                        >
                            ✅ Curso Concluído
                        </span>
                        <span 
                            v-if="inscricao.status === 'Fila de Espera'" 
                            class="badge badge-fila"
                        >
                            Fila de Espera
                        </span>
                    </div>

                    
                    <div class="curso-content">
                        <h3 class="curso-nome">{{ inscricao.cursoId.nome }}</h3>
                        <p class="curso-descricao">{{ inscricao.cursoId.descricao }}</p>

                        <div class="curso-info">
                            <div class="info-item">
                                <iconify-icon icon="hugeicons:calendar-03" width="18" height="18"></iconify-icon>
                                <span>Início: {{ formatarData(inscricao.cursoId.dataInicio) }}</span>
                            </div>
                            <div class="info-item">
                                <iconify-icon icon="hugeicons:calendar-check-02" width="18" height="18"></iconify-icon>
                                <span>Término: {{ formatarData(inscricao.cursoId.dataTermino) }}</span>
                            </div>
                            <div class="info-item">
                                <iconify-icon icon="hugeicons:user-circle" width="18" height="18"></iconify-icon>
                                <span>Inscrito em: {{ formatarData(inscricao.dataInscricao) }}</span>
                            </div>
                        </div>
                    </div>

                    
                    <div class="curso-actions">
                        <router-link 
                            :to="`/cursos/${inscricao.cursoId._id}`"
                            class="btn-ver-detalhes"
                        >
                            <iconify-icon icon="hugeicons:view" width="20" height="20"></iconify-icon>
                            Ver Detalhes
                        </router-link>

                        
                        <button 
                            v-if="inscricao.statusCurso === 'em_andamento' && inscricao.status === 'Inscrito'"
                            @click="concluirCurso(inscricao)"
                            class="btn-concluir"
                            :disabled="inscricao.concluindo"
                        >
                            <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                            <span v-if="!inscricao.concluindo">Marcar como Concluído</span>
                            <span v-else>Processando...</span>
                        </button>

                        
                        <button 
                            v-if="inscricao.status === 'Concluido' && !inscricao.jaAvaliou"
                            @click="abrirModalAvaliacao(inscricao)"
                            class="btn-avaliar"
                        >
                            <iconify-icon icon="hugeicons:star" width="20" height="20"></iconify-icon>
                            Avaliar Curso
                        </button>

                        
                        <div v-if="inscricao.jaAvaliou" class="ja-avaliado">
                            <iconify-icon icon="hugeicons:tick-double-02" width="20" height="20"></iconify-icon>
                            Já avaliado
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
        <div v-if="modalAvaliacao.aberto" class="modal-overlay" @click.self="fecharModalAvaliacao">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Avaliar Curso</h2>
                    <button @click="fecharModalAvaliacao" class="btn-fechar">
                        <iconify-icon icon="hugeicons:cancel-01" width="24" height="24"></iconify-icon>
                    </button>
                </div>

                <div class="modal-body">
                    <h3 class="curso-nome-modal">{{ modalAvaliacao.curso?.cursoId?.nome }}</h3>

                    
                    <div class="avaliacao-estrelas">
                        <label>Sua avaliação:</label>
                        <div class="estrelas">
                            <iconify-icon 
                                v-for="n in 5" 
                                :key="n"
                                :icon="n <= modalAvaliacao.nota ? 'hugeicons:star' : 'hugeicons:star'"
                                :class="['estrela', { 'preenchida': n <= modalAvaliacao.nota }]"
                                @click="modalAvaliacao.nota = n"
                                width="40" 
                                height="40"
                            ></iconify-icon>
                        </div>
                        <p class="nota-texto">{{ modalAvaliacao.nota }} de 5 estrelas</p>
                    </div>

                    
                    <div class="form-group">
                        <label for="mensagem">Deixe seu comentário:</label>
                        <textarea 
                            v-model="modalAvaliacao.mensagem"
                            id="mensagem"
                            rows="5"
                            placeholder="Conte sobre sua experiência com o curso..."
                            class="form-input"
                            required
                        ></textarea>
                    </div>

                    <div v-if="modalAvaliacao.erro" class="error-message">
                        {{ modalAvaliacao.erro }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button 
                        @click="enviarAvaliacao"
                        class="btn-enviar"
                        :disabled="modalAvaliacao.enviando || !modalAvaliacao.mensagem"
                    >
                        <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                        <span v-if="!modalAvaliacao.enviando">Enviar Avaliação</span>
                        <span v-else>Enviando...</span>
                    </button>
                    <button @click="fecharModalAvaliacao" class="btn-cancelar">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    name: 'MeusCursosView',
    data() {
        return {
            inscricoes: [],
            loading: true,
            error: '',
            filtroAtivo: 'todos',
            modalAvaliacao: {
                aberto: false,
                curso: null,
                nota: 5,
                mensagem: '',
                enviando: false,
                erro: ''
            }
        };
    },
    computed: {
        cursosFiltrados() {
            if (this.filtroAtivo === 'todos') {
                return this.inscricoes;
            }
            return this.inscricoes.filter(i => i.statusCurso === this.filtroAtivo);
        },
        cursosCount() {
            return {
                todos: this.inscricoes.length,
                em_andamento: this.inscricoes.filter(i => i.statusCurso === 'em_andamento').length,
                vai_iniciar: this.inscricoes.filter(i => i.statusCurso === 'vai_iniciar').length,
                concluido: this.inscricoes.filter(i => i.statusCurso === 'concluido').length
            };
        }
    },
    async mounted() {
        await this.carregarCursos();
    },
    methods: {
        async carregarCursos() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user._id) {
                    this.$router.push('/');
                    return;
                }

                const { data } = await api.get(`/inscricoes/usuario/${user._id}`);
                
                for (const inscricao of data) {
                    if (inscricao.status === 'Concluido') {
                        const { data: verificacao } = await api.get(
                            `/avaliacoes/verificar/${inscricao.cursoId._id}/${user._id}`
                        );
                        inscricao.jaAvaliou = verificacao.jaAvaliou;
                    }
                }

                this.inscricoes = data;
                this.loading = false;
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
                this.error = 'Erro ao carregar seus cursos. Tente novamente.';
                this.loading = false;
            }
        },
        async concluirCurso(inscricao) {
            if (!confirm('Tem certeza que deseja marcar este curso como concluído?')) {
                return;
            }

            this.$set(inscricao, 'concluindo', true);

            try {
                await api.patch(`/inscricoes/${inscricao._id}/concluir`);
                
                inscricao.status = 'Concluido';
                inscricao.statusCurso = 'concluido';
                inscricao.jaAvaliou = false;
                
                alert('Curso marcado como concluído! Agora você pode avaliá-lo.');
            } catch (error) {
                console.error('Erro ao concluir curso:', error);
                alert('Erro ao concluir curso. Tente novamente.');
            } finally {
                inscricao.concluindo = false;
            }
        },
        abrirModalAvaliacao(inscricao) {
            this.modalAvaliacao = {
                aberto: true,
                curso: inscricao,
                nota: 5,
                mensagem: '',
                enviando: false,
                erro: ''
            };
        },
        fecharModalAvaliacao() {
            this.modalAvaliacao = {
                aberto: false,
                curso: null,
                nota: 5,
                mensagem: '',
                enviando: false,
                erro: ''
            };
        },
        async enviarAvaliacao() {
            if (!this.modalAvaliacao.mensagem.trim()) {
                this.modalAvaliacao.erro = 'Por favor, escreva um comentário.';
                return;
            }

            this.modalAvaliacao.enviando = true;
            this.modalAvaliacao.erro = '';

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                
                await api.post('/avaliacoes', {
                    usuarioId: user._id,
                    cursoId: this.modalAvaliacao.curso.cursoId._id,
                    nota: this.modalAvaliacao.nota,
                    mensagem: this.modalAvaliacao.mensagem
                });

                
                const inscricao = this.inscricoes.find(i => i._id === this.modalAvaliacao.curso._id);
                if (inscricao) {
                    inscricao.jaAvaliou = true;
                }

                alert('Avaliação enviada com sucesso!');
                this.fecharModalAvaliacao();
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error);
                this.modalAvaliacao.erro = error.response?.data?.message || 'Erro ao enviar avaliação.';
            } finally {
                this.modalAvaliacao.enviando = false;
            }
        },
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        getStatusLabel(status) {
            const labels = {
                'em_andamento': 'Em Andamento',
                'vai_iniciar': 'Vai Iniciar',
                'concluido': 'Concluído',
                'desconhecido': 'Status Desconhecido'
            };
            return labels[status] || status;
        }
    }
};
</script>

<style scoped>
.meus-cursos-page {
    min-height: calc(100vh - 120px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem 1rem;
}

.meus-cursos-container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #133328;
    margin-bottom: 2rem;
}


.filtros-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.filtro-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filtro-btn:hover {
    border-color: #4e9e47;
    transform: translateY(-2px);
}

.filtro-btn.ativo {
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
    border-color: #4e9e47;
}


.loading-message {
    text-align: center;
    padding: 3rem;
    color: #666;
}

.rotating {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    border-left: 4px solid #c33;
}


.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-state iconify-icon {
    color: #ccc;
    margin-bottom: 1rem;
}

.empty-state h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #666;
    margin-bottom: 2rem;
}


.cursos-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.curso-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}

.curso-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}


.status-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.badge-em_andamento {
    background: #e3f2fd;
    color: #1976d2;
}

.badge-vai_iniciar {
    background: #fff3e0;
    color: #f57c00;
}

.badge-concluido {
    background: #e8f5e9;
    color: #388e3c;
}

.badge-fila {
    background: #f3e5f5;
    color: #7b1fa2;
}


.curso-content {
    flex: 1;
    margin-bottom: 1rem;
}

.curso-nome {
    font-size: 1.25rem;
    font-weight: 700;
    color: #133328;
    margin-bottom: 0.5rem;
}

.curso-descricao {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.curso-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}

.info-item iconify-icon {
    color: #4e9e47;
}


.curso-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}

.btn-ver-detalhes,
.btn-concluir,
.btn-avaliar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.btn-ver-detalhes {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e0e0e0;
}

.btn-ver-detalhes:hover {
    background: #e9ecef;
}

.btn-concluir {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
}

.btn-concluir:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-concluir:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-avaliar {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    color: white;
}

.btn-avaliar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.ja-avaliado {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #e8f5e9;
    color: #388e3c;
    border-radius: 8px;
    font-weight: 600;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
    font-size: 1.5rem;
    color: #133328;
}

.btn-fechar {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    transition: color 0.3s;
}

.btn-fechar:hover {
    color: #c33;
}

.modal-body {
    padding: 2rem;
}

.curso-nome-modal {
    font-size: 1.25rem;
    color: #133328;
    margin-bottom: 1.5rem;
    text-align: center;
}

.avaliacao-estrelas {
    text-align: center;
    margin-bottom: 2rem;
}

.avaliacao-estrelas label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
}

.estrelas {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.estrela {
    cursor: pointer;
    color: #ddd;
    transition: all 0.2s ease;
}

.estrela:hover,
.estrela.preenchida {
    color: #ffc107;
    transform: scale(1.1);
}

.nota-texto {
    font-size: 1.1rem;
    color: #666;
    font-weight: 600;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
}

.form-input:focus {
    outline: none;
    border-color: #4e9e47;
}

.modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.btn-enviar,
.btn-cancelar {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-enviar {
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
}

.btn-enviar:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}

.btn-enviar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancelar {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e0e0e0;
}

.btn-cancelar:hover {
    background: #e9ecef;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}

.badge-curso-concluido {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
    font-weight: 700;
}
</style>
