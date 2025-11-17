<template>
    <div class="curso-detalhes-view section">
        <div class="main-container">
            <div v-if="carregando" class="status-message loading">
                Carregando detalhes do curso...
            </div>
            <div v-else-if="erro" class="status-message error-box">
                Erro: {{ erro }}. Tente recarregar.
            </div>
            
            <div v-else-if="curso" class="curso-content">
                <div class="col-main">
                    <div class="bloco-curso-principal">
                        <button @click="voltarAoCatalogo" class="btn-back-link">
                            ← Voltar ao Catálogo
                        </button>

                        <h1 class="title-course">{{ curso.nome }}</h1>
                        <p class="subtitle-course">{{ curso.descricao }}</p>

                        <div class="detalhes-secundarios">
                            <h3 class="secao-titulo">Informações Essenciais</h3>
                            
                            <div class="instrutores-section">
                                <p class="detalhe-item-title">👨‍🏫 Instrutores:</p>
                                <div class="instrutores-lista">
                                    <div 
                                        v-for="instrutor in curso.instrutores" 
                                        :key="instrutor._id"
                                        class="instrutor-card-small"
                                    >
                                        <img 
                                            :src="instrutor.foto || `https://ui-avatars.com/api/?name=${instrutor.nome}&background=4e9e47&color=fff`" 
                                            :alt="instrutor.nome"
                                            class="instrutor-avatar-small"
                                        />
                                        <div class="instrutor-info-small">
                                            <strong>{{ instrutor.nome }}</strong>
                                            <span class="instrutor-email-small">{{ instrutor.email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p class="detalhe-item">👥 Público Alvo: <span class="detalhe-valor">{{ curso.publico }}</span></p>
                            <p class="detalhe-item">🔞 Faixa Etária: <span class="detalhe-valor">{{ curso.faixaEtaria }}</span></p>
                           <p class="detalhe-item">Proficiências Adquiridas: 
                            <span v-if="curso.proficiencias && curso.proficiencias.length > 0">
                                <span 
                                    v-for="prof in curso.proficiencias" 
                                    :key="prof" 
                                    class="detalhe-valor tag tag-primary"
                                >
                                    {{ prof }}
                                </span>
                            </span>
                            <span v-else class="tag tag-info">Nenhuma</span>
                        </p>
                        </div>

                        <div class="bloco-secao">
                            <h3 class="secao-titulo">Conteúdo Programático</h3>
                            <p>{{ curso.conteudo }}</p>
                        </div>

                        <div class="bloco-secao">
                            <h3 class="secao-titulo">Pré-Requisitos</h3>
                            <p>{{ curso.preRequisitos }}</p> 
                        </div>
                    </div>

                    <div class="bloco-curso-principal avaliacoes-section">
                        <h3 class="secao-titulo">Avaliações do Curso</h3>
                        
                        <div v-if="carregandoAvaliacoes" class="loading-avaliacoes">
                            <iconify-icon icon="hugeicons:loading-03" width="32" height="32" class="rotating"></iconify-icon>
                            <p>Carregando avaliações...</p>
                        </div>

                        <div v-else-if="avaliacoes.length === 0" class="empty-avaliacoes">
                            <iconify-icon icon="hugeicons:message-02" width="48" height="48"></iconify-icon>
                            <p>Este curso ainda não possui avaliações.</p>
                        </div>

                        <div v-else>
                           
                            <div v-if="totalAvaliacoes > 0" class="avaliacoes-header">
                                <div class="media-avaliacoes">
                                    <div class="estrelas-media">
                                        <iconify-icon 
                                            v-for="n in 5" 
                                            :key="n"
                                            icon="hugeicons:star"
                                            :class="['estrela-display', { 'preenchida': n <= Math.round(mediaAvaliacoes) }]"
                                            width="32" 
                                            height="32"
                                        ></iconify-icon>
                                    </div>
                                    <div class="media-texto">
                                        <span class="media-numero">{{ mediaAvaliacoes.toFixed(1) }}</span>
                                        <span class="media-total">de 5 ({{ totalAvaliacoes }} avaliações)</span>
                                    </div>
                                </div>

                                
                                <div v-if="resumoIA" class="resumo-ia">
                                    <div class="resumo-ia-header">
                                        <iconify-icon icon="hugeicons:sparkles" width="20" height="20"></iconify-icon>
                                        <strong>Resumo gerado por IA</strong>
                                    </div>
                                    <p class="resumo-ia-texto">{{ resumoIA }}</p>
                                </div>
                            </div>

                            
                            <div class="avaliacoes-lista">
                                <div 
                                    v-for="avaliacao in avaliacoes" 
                                    :key="avaliacao._id"
                                    :class="['avaliacao-card', { 'oculta': avaliacao.oculta }]"
                                >
                                    <div v-if="!avaliacao.oculta">
                                        <div class="avaliacao-header">
                                            <div class="usuario-info">
                                                <img 
                                                    :src="avaliacao.usuarioId?.foto || defaultAvatar" 
                                                    alt="Foto do usuário"
                                                    class="usuario-avatar"
                                                />
                                                <div>
                                                    <strong class="usuario-nome">{{ avaliacao.usuarioId?.nome || 'Usuário' }}</strong>
                                                    <div class="avaliacao-estrelas">
                                                        <iconify-icon 
                                                            v-for="n in 5" 
                                                            :key="n"
                                                            icon="hugeicons:star"
                                                            :class="['estrela-pequena', { 'preenchida': n <= avaliacao.nota }]"
                                                            width="16" 
                                                            height="16"
                                                        ></iconify-icon>
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="avaliacao-data">{{ formatarData(avaliacao.createdAt) }}</span>
                                        </div>
                                        <p class="avaliacao-mensagem">{{ avaliacao.mensagem }}</p>
                                        
                                        
                                        <button 
                                            v-if="isAdmin"
                                            @click="toggleOcultarAvaliacao(avaliacao)"
                                            class="btn-ocultar"
                                        >
                                            <iconify-icon icon="hugeicons:eye-off" width="16" height="16"></iconify-icon>
                                            Ocultar avaliação
                                        </button>
                                    </div>
                                    
                                    
                                    <div v-else class="avaliacao-oculta-box">
                                        <iconify-icon icon="hugeicons:eye-off" width="24" height="24"></iconify-icon>
                                        <p><em>Este comentário foi ocultado pelo professor ou coordenador.</em></p>
                                        
                                        
                                        <button 
                                            v-if="isAdmin"
                                            @click="toggleOcultarAvaliacao(avaliacao)"
                                            class="btn-mostrar"
                                        >
                                            <iconify-icon icon="hugeicons:view" width="16" height="16"></iconify-icon>
                                            Mostrar novamente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-sidebar">
                    <div class="card-acao">
                        <div class="info-vagas">
                            <p class="vagas-titulo">Vagas e Ação</p>
                            <p class="vagas-item">📍 Local: <span class="tag tag-info">{{ curso.local }}</span></p>
                            <p class="vagas-item">⌚ Horário: {{ curso.horario }}</p>
                            <p class="vagas-item">📊 Máximo de Vagas: {{ curso.maximoVagas }}</p>
                            <p class="vagas-item">👥 Inscritos: {{ inscritosCount }}</p>
                            
                            <p class="vagas-status" :class="statusClass">
                                {{ statusText }}
                            </p>
                        </div>
                        
                        <button 
                            class="btn btn-primary btn-full-width btn-acao" 
                            @click="iniciarInscricao" 
                            :disabled="!isActionable || carregandoInscricao"
                        >
                            <span v-if="carregandoInscricao">Processando...</span>
                            <span v-else>{{ actionButtonText }}</span>
                        </button>

                        <div v-if="mensagem" :class="['feedback-msg', {'success': !erroInscricao, 'error': erroInscricao}]">
                            {{ mensagem }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="status-message warning-box">
                Curso não encontrado.
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import api from '@/services/api';

const PLACEHOLDER_ID = '000000000000000000000000';

export default {
    name: 'CursoDetalhesView',
    props: ['id'],

    data() {
        return {
            curso: null, 
            carregando: true,
            erro: null,
            
            
            vagasDisponiveis: 0, 
            statusInscricao: 'carregando',
            inscritosCount: 0,
            
            carregandoInscricao: false,
            mensagem: '',
            erroInscricao: false,
            API_BASE_URL: 'http://localhost:3000/api',
            
            
            userId: null, 
            userProficiencias: [],
            isAdmin: false,
            isProfessor: false,
            
            
            avaliacoes: [],
            mediaAvaliacoes: 0,
            totalAvaliacoes: 0,
            carregandoAvaliacoes: true,
            resumoIA: '',
            defaultAvatar: 'https://ui-avatars.com/api/?name=User&background=4e9e47&color=fff'
        };
    },
    computed: {
        isCursoConcluido() {
            return this.curso?.concluido || false;
        },
        isInscricoesEncerradas() {
            if (!this.curso?.dataInicio) return false;
            
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            const dataInicio = new Date(this.curso.dataInicio);
            dataInicio.setHours(0, 0, 0, 0);
            
            
            return hoje >= dataInicio;
        },
        statusClass() {
            if (this.isCursoConcluido) return 'status-concluido';
            if (this.isInscricoesEncerradas) return 'status-encerrado';
            if (this.statusInscricao === 'Inscrito') return 'status-inscrito';
            if (this.statusInscricao === 'Fila de Espera') return 'status-fila';
            if (this.statusInscricao === 'PreRequisitoFaltando') return 'status-erro';
            
            return this.vagasDisponiveis > 0 ? 'status-disponivel' : 'status-lotado';
        },
        statusText() {
            if (this.isCursoConcluido) return '🏁 Curso Concluído';
            if (this.isInscricoesEncerradas) return '🚫 Inscrições Encerradas';
            if (this.statusInscricao === 'Inscrito') return '✅ Você está INSCRITO!';
            if (this.statusInscricao === 'Fila de Espera') return '⏳ Na FILA DE ESPERA';
            if (this.statusInscricao === 'PreRequisitoFaltando') return '❌ Pré-requisitos não atendidos';

            return this.vagasDisponiveis > 0 
                ? `Vagas Disponíveis: ${this.vagasDisponiveis}` 
                : 'Vagas Esgotadas';
        },
        actionButtonText() {
            if (this.isProfessor) return 'VOCÊ É PROFESSOR';
            if (this.isCursoConcluido) return 'CURSO CONCLUÍDO';
            if (this.isInscricoesEncerradas) return 'INSCRIÇÕES ENCERRADAS';
            if (this.statusInscricao === 'Inscrito') return 'JÁ INSCRITO';
            if (this.statusInscricao === 'Fila de Espera') return 'NA FILA';
            if (this.statusInscricao === 'PreRequisitoFaltando') return 'VER PRÉ-REQUISITOS';
            
            if (!this.userId) return 'FAÇA LOGIN PARA INSCRIÇÃO';
            
            return this.vagasDisponiveis > 0 ? 'Inscrever-se Agora' : 'Entrar na Fila de Espera';
        },
        isActionable() {
            if (this.isCursoConcluido || this.isInscricoesEncerradas || this.isProfessor) return false;
            return !!this.userId && (this.statusInscricao === 'NaoInscrito' || this.statusInscricao === 'disponivel' || this.statusInscricao === 'lotado');
        }
    },
    mounted() {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            this.userId = userData._id || userData.id; 
            this.userProficiencias = userData.proficiencias || [];
            this.isAdmin = userData.nivel === 'admin';
            this.isProfessor = userData.nivel === 'professor' || userData.nivel === 'admin';
        }

        const cursoId = this.id || this.$route.params.id; 
        this.carregarCurso(cursoId);
        this.carregarAvaliacoes(cursoId);
    },
    methods: {
        voltarAoCatalogo() {
            this.$router.push('/cursos'); 
        },

        async carregarCurso(id) {
            this.carregando = true;
            this.erro = null;

            if (!id || id.length !== 24) {
                this.erro = "ID do curso inválido. Retorne ao catálogo.";
                this.carregando = false;
                this.curso = null;
                return;
            }

            try {
                const responseCurso = await axios.get(`${this.API_BASE_URL}/cursos/${id}`);
                this.curso = responseCurso.data;

                const statusResponse = await axios.get(`${this.API_BASE_URL}/inscricoes/status/${id}/${this.userId || PLACEHOLDER_ID}`);
                this.vagasDisponiveis = statusResponse.data.vagasDisponiveis;
                this.statusInscricao = statusResponse.data.statusUsuario;
                this.inscritosCount = (this.curso.maximoVagas || 0) - (statusResponse.data.vagasDisponiveis || 0);
            } catch (err) {
                console.error("Erro ao carregar detalhes do curso:", err);
                this.erro = "Curso não encontrado.";
                this.curso = null;
            } finally {
                this.carregando = false;
            }
        },


        async iniciarInscricao() {
            this.carregandoInscricao = true;
            this.mensagem = '';
            this.erroInscricao = false;

            if (!this.userId) {
                this.mensagem = '❌ Você precisa estar logado para se inscrever.';
                this.erroInscricao = true;
                this.carregandoInscricao = false;
                return;
            }

            try {
                const idParaInscricao = this.curso.id || this.curso._id;
                
                if (!idParaInscricao) {
                    throw new Error("ID do curso não encontrado no objeto carregado.");
                }

                const response = await axios.post(`${this.API_BASE_URL}/inscricoes`, {
                    usuarioId: this.userId,
                    cursoId: idParaInscricao, 
                    usuarioProficiencias: this.userProficiencias
                });

                this.mensagem = response.data.message;
                this.erroInscricao = false;
                this.vagasDisponiveis = response.data.vagasDisponiveis;
                this.statusInscricao = response.data.status;
            } catch (error) {
                console.error('Erro na inscrição:', error.response || error);
                this.erroInscricao = true;
                this.mensagem = error.response ? error.response.data.message : '❌ Erro ao conectar com o servidor.';
            } finally {
                this.carregandoInscricao = false;
            }
        },

        async carregarAvaliacoes(cursoId) {
            try {
                const { data } = await api.get(`/avaliacoes/curso/${cursoId}`);
                this.avaliacoes = data.avaliacoes;
                this.mediaAvaliacoes = data.media;
                this.totalAvaliacoes = data.total;
                this.resumoIA = data.resumo?.texto || '';
            } catch (error) {
                console.error('Erro ao carregar avaliações:', error);
            } finally {
                this.carregandoAvaliacoes = false;
            }
        },

        async toggleOcultarAvaliacao(avaliacao) {
            const novoEstado = !avaliacao.oculta;
            const confirmacao = novoEstado 
                ? 'Tem certeza que deseja ocultar esta avaliação?' 
                : 'Deseja tornar esta avaliação visível novamente?';

            if (!confirm(confirmacao)) return;

            try {
                await api.patch(`/avaliacoes/${avaliacao._id}/ocultar`, {
                    oculta: novoEstado
                });
                
                // Recarregar avaliações para atualizar média e resumo
                const cursoId = this.id || this.$route.params.id;
                await this.carregarAvaliacoes(cursoId);
                
                alert(novoEstado ? 'Avaliação ocultada e resumo atualizado.' : 'Avaliação visível novamente e resumo atualizado.');
            } catch (error) {
                console.error('Erro ao alterar visibilidade:', error);
                alert('Erro ao processar a solicitação.');
            }
        },

        formatarData(data) {
            if (!data) return '';
            return new Date(data).toLocaleDateString('pt-BR');
        }
    }
};
</script>

<style scoped>
.main-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.curso-content { display: flex; gap: 30px; }
.col-main { flex: 3; }
.col-sidebar { flex: 1; min-width: 300px; }
.bloco-curso-principal { background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); }
.title-course { font-size: 2.5rem; font-weight: 700; color: var(--color-dark); margin-bottom: 0.5rem; }
.subtitle-course { font-size: 1.1rem; color: #666; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
.bloco-secao { margin-top: 2.5rem; }
.secao-titulo { font-size: 1.5rem; font-weight: 600; color: var(--color-dark); margin-bottom: 1.2rem; border-left: 4px solid var(--color-primary); padding-left: 15px; }
.btn-back-link { background: none; border: none; color: var(--color-dark); font-size: 1rem; cursor: pointer; padding: 10px 0; margin-bottom: 20px; font-weight: 600; transition: color 0.2s, transform 0.2s; display: flex; align-items: center; gap: 8px; }
.btn-back-link:hover { color: var(--color-primary); transform: translateX(-5px); }
.card-acao { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); position: sticky; top: 5rem; }
.info-vagas { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--color-light-bg); }
.vagas-titulo { font-size: 1.2rem; font-weight: 600; margin-bottom: 10px; }
.vagas-item { font-size: 0.95rem; margin-bottom: 8px; }
.vagas-status { font-weight: 700; margin-top: 15px; font-size: 1.1rem; }
.vagas-status.status-disponivel { color: var(--color-primary); }
.vagas-status.status-lotado, .vagas-status.status-erro { color: #cc0000; }
.vagas-status.status-inscrito { color: #007bff; }
.vagas-status.status-fila { color: orange; }
.vagas-status.status-concluido { color: #6c757d; }
.vagas-status.status-encerrado { color: #dc3545; }
.btn-acao { padding: 14px 20px; font-size: 1.1rem; font-weight: 700; transition: background-color 0.3s, opacity 0.3s; }
.btn-acao[disabled] { opacity: 0.6; cursor: not-allowed; }
.feedback-msg { margin-top: 15px; padding: 10px; border-radius: 4px; font-weight: 500; text-align: center; }
.feedback-msg.success { background-color: #e0f8e0; color: var(--color-primary); border: 1px solid var(--color-primary); }
.feedback-msg.error { background-color: #fce8e8; color: #cc0000; border: 1px solid #cc0000; }
@media (max-width: 900px) {
    .curso-content { flex-direction: column; }
    .col-sidebar { min-width: 100%; order: -1; }
    .card-acao { position: static; }
}

.avaliacoes-section {
    margin-top: 30px;
    margin-bottom: 60px;
}

.loading-avaliacoes,
.empty-avaliacoes {
    text-align: center;
    padding: 2rem 1.5rem;
    color: #666;
}

.empty-avaliacoes iconify-icon {
    color: #ccc;
    margin-bottom: 1rem;
}

.rotating {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.avaliacoes-header {
    background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.media-avaliacoes {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
}

.estrelas-media {
    display: flex;
    gap: 0.25rem;
}

.estrela-display {
    color: #ddd;
}

.estrela-display.preenchida {
    color: #ffc107;
}

.media-texto {
    display: flex;
    flex-direction: column;
}

.media-numero {
    font-size: 2.5rem;
    font-weight: 700;
    color: #133328;
}

.media-total {
    font-size: 0.9rem;
    color: #666;
}

.resumo-ia {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #0014a8;
}

.resumo-ia-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #0014a8;
}

.resumo-ia-texto {
    color: #333;
    line-height: 1.6;
}

.btn-gerar-resumo {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #0014a8 0%, #000a5c 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-gerar-resumo:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 20, 168, 0.4);
}

.loading-resumo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
}

.avaliacoes-lista {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.avaliacao-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avaliacao-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.avaliacao-card.oculta {
    background: #f5f5f5;
}

.avaliacao-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.usuario-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.usuario-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.usuario-nome {
    display: block;
    font-size: 1rem;
    color: #133328;
    margin-bottom: 0.25rem;
}

.avaliacao-estrelas {
    display: flex;
    gap: 0.15rem;
}

.estrela-pequena {
    color: #ddd;
}

.estrela-pequena.preenchida {
    color: #ffc107;
}

.avaliacao-data {
    font-size: 0.85rem;
    color: #999;
}

.avaliacao-mensagem {
    color: #333;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.btn-ocultar,
.btn-mostrar {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-ocultar {
    background: #fee;
    color: #c33;
}

.btn-ocultar:hover {
    background: #fdd;
}

.btn-mostrar {
    background: #e8f5e9;
    color: #388e3c;
}

.btn-mostrar:hover {
    background: #c8e6c9;
}

.avaliacao-oculta-box {
    background: #d9d9d9;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    color: #666;
}

.avaliacao-oculta-box iconify-icon {
    margin-bottom: 0.5rem;
}

.avaliacao-oculta-box p {
    font-style: italic;
    margin-bottom: 1rem;
}

.instrutores-section {
    margin-bottom: 1.5rem;
}

.detalhe-item-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
}

.instrutores-lista {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-left: 0.5rem;
}

.instrutor-card-small {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #4e9e47;
    transition: all 0.2s ease;
}

.instrutor-card-small:hover {
    background: #e8f5e8;
    transform: translateX(4px);
}

.instrutor-avatar-small {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #4e9e47;
}

.instrutor-info-small {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.instrutor-info-small strong {
    font-size: 0.95rem;
    color: #133328;
}

.instrutor-email-small {
    font-size: 0.85rem;
    color: #666;
}
</style>