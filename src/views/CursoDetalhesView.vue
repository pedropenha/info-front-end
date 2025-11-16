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
                            <p class="detalhe-item">👨‍🏫 Instrutor: <span class="detalhe-valor">{{ curso.instrutores }}</span></p>
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
                </div>

                <div class="col-sidebar">
                    <div class="card-acao">
                        <div class="info-vagas">
                            <p class="vagas-titulo">Vagas e Ação</p>
                            <p class="vagas-item">📍 Local: <span class="tag tag-info">{{ curso.local }}</span></p>
                            <p class="vagas-item">⌚ Horário: {{ curso.horario }}</p>
                            <p class="vagas-item">📊 Máximo de Vagas: {{ curso.maximoVagas }}</p>
                            
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

const PLACEHOLDER_ID = '000000000000000000000000';

export default {
    name: 'CursoDetalhesView',
    props: ['id'], // O ID da rota é injetado como prop

    data() {
        return {
            curso: null, 
            carregando: true,
            erro: null,
            
            // Variáveis de Estado de Inscrição:
            vagasDisponiveis: 0, 
            statusInscricao: 'carregando', // 'NaoInscrito', 'Inscrito', 'Fila de Espera', 'PreRequisitoFaltando'
            
            carregandoInscricao: false,
            mensagem: '',
            erroInscricao: false,
            API_BASE_URL: 'http://localhost:3000/api',
            
            // Variáveis do usuário (Obtidas do localStorage)
            userId: null, 
            userProficiencias: [], 
        };
    },
    computed: {
        statusClass() {
            if (this.statusInscricao === 'Inscrito') return 'status-inscrito';
            if (this.statusInscricao === 'Fila de Espera') return 'status-fila';
            if (this.statusInscricao === 'PreRequisitoFaltando') return 'status-erro';
            
            return this.vagasDisponiveis > 0 ? 'status-disponivel' : 'status-lotado';
        },
        statusText() {
            if (this.statusInscricao === 'Inscrito') return '✅ Você está INSCRITO!';
            if (this.statusInscricao === 'Fila de Espera') return '⏳ Na FILA DE ESPERA';
            if (this.statusInscricao === 'PreRequisitoFaltando') return '❌ Pré-requisitos não atendidos';

            return this.vagasDisponiveis > 0 
                ? `Vagas Disponíveis: ${this.vagasDisponiveis}` 
                : 'Vagas Esgotadas';
        },
        actionButtonText() {
            if (this.statusInscricao === 'Inscrito') return 'JÁ INSCRITO';
            if (this.statusInscricao === 'Fila de Espera') return 'NA FILA';
            if (this.statusInscricao === 'PreRequisitoFaltando') return 'VER PRÉ-REQUISITOS';
            
            if (!this.userId) return 'FAÇA LOGIN PARA INSCRIÇÃO';
            
            return this.vagasDisponiveis > 0 ? 'Inscrever-se Agora' : 'Entrar na Fila de Espera';
        },
        isActionable() {
            return !!this.userId && (this.statusInscricao === 'NaoInscrito' || this.statusInscricao === 'disponivel' || this.statusInscricao === 'lotado');
        }
    },
    mounted() {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            this.userId = userData._id || userData.id; 
            this.userProficiencias = userData.proficiencias || [];
        }

        const cursoId = this.id || this.$route.params.id; 
        this.carregarCurso(cursoId);
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
        }
    }
};
</script>

<style scoped>
.main-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.curso-content { display: flex; gap: 30px; }
.col-main { flex: 3; }
.col-sidebar { flex: 1; min-width: 300px; }
.bloco-curso-principal { background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); height: 100%; }
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
</style>