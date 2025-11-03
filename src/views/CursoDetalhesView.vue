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
                    <button @click="voltarAoCatalogo" class="btn-back-link">
                            ← Voltar ao Catálogo
                    </button>

                    <div class="bloco-curso-principal">  <h1 class="title-course">{{ curso.nome }}</h1>
                        <p class="subtitle-course">{{ curso.descricao }}</p>

                        

                        <div class="detalhes-secundarios">
                            <h3 class="secao-titulo">Informações Essenciais</h3>
                            <div class="detalhe-item">
                                <span class="detalhe-label">👨‍🏫 Instrutor:</span>
                                <span class="detalhe-valor">{{ curso.instrutores }}</span>
                            </div>
                            <div class="detalhe-item">
                                <span class="detalhe-label">👥 Público Alvo:</span>
                                <span class="detalhe-valor">{{ curso.publico }}</span>
                            </div>
                            <div class="detalhe-item">
                                <span class="detalhe-label">🔞 Faixa Etária:</span>
                                <span class="detalhe-valor">{{ curso.faixaEtaria }}</span>
                            </div>
                        </div>

                        <div class="bloco-secao">
                            <h3 class="secao-titulo">Conteúdo Programático</h3>
                            <p>{{ curso.conteudo }}</p>
                        </div>

                        <div class="bloco-secao">
                            <h3 class="secao-titulo">Pré-Requisitos</h3>
                            <p>{{ curso.preRequisitos }}</p> 
                        </div>
                        
                    </div> </div>

                <div class="col-sidebar">
                    <div class="card-acao">
                        <div class="info-vagas">
                            <p class="vagas-titulo">Vagas e Local</p>
                            <p class="vagas-item">📍 Local: 
                                <span class="tag tag-info">{{ curso.local }}</span>
                            </p>
                            <p class="vagas-item">⌚ Horário: {{ curso.horario }}</p>
                            <p class="vagas-item">
                                📊 Máximo de Vagas: {{ curso.maximoVagas }}
                            </p>
                            <p class="vagas-status" :class="{'disponivel': vagasDisponiveis > 0, 'esgotado': vagasDisponiveis <= 0}">
                                Vagas Disponíveis: {{ vagasDisponiveis > 0 ? vagasDisponiveis : 'Esgotadas' }}
                            </p>
                        </div>
                        
                        <button 
                            class="btn btn-primary btn-full-width btn-acao" 
                            @click="iniciarInscricao" 
                            :disabled="carregandoInscricao">
                            {{ vagasDisponiveis > 0 ? 'Inscrever-se Agora' : 'Entrar na Fila de Espera' }}
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

export default {
    name: 'CursoDetalhesView',
    data() {
        return {
            curso: null, 
            carregando: true,
            erro: null,
            vagasDisponiveis: 5, // Placeholder - A ser substituído pela lógica real
            carregandoInscricao: false,
            mensagem: '',
            erroInscricao: false,
            API_BASE_URL: 'http://localhost:3000/api',
        };
    },
    // Executa a busca ao montar o componente
    mounted() {
        this.carregarCurso(this.$route.params.id);
    },
    methods: {
        async carregarCurso(id) {
            this.carregando = true;
            this.erro = null;
            try {
                // Endpoint GET /api/cursos/:id
                const response = await axios.get(`${this.API_BASE_URL}/cursos/${id}`);
                this.curso = response.data;
                
                // Simulação de vagas (Será substituído na próxima iteração pela contagem real)
                if (this.curso.maximoVagas) {
                    // Aqui você faria a contagem de vagas ocupadas do servidor
                    this.vagasDisponiveis = this.curso.maximoVagas - 10; // Exemplo: 10 ocupadas
                }

            } catch (err) {
                console.error("Erro ao carregar detalhes do curso:", err);
                this.erro = "Detalhes não encontrados. Verifique se o ID está correto.";
            } finally {
                this.carregando = false;
            }
        },
        async iniciarInscricao() {
            // Lógica de Inscrição REAL será implementada na próxima iteração
            this.carregandoInscricao = true;
            this.mensagem = '';
            this.erroInscricao = false;

            // Simulação de Sucesso/Falha para teste de design
            const isSuccess = Math.random() > 0.3; 

            setTimeout(() => {
                this.carregandoInscricao = false;
                if (isSuccess) {
                    this.mensagem = this.vagasDisponiveis > 0 
                                    ? 'Inscrição realizada com sucesso! 🎉' 
                                    : 'Adicionado à Fila de Espera. Enviaremos uma notificação.';
                    // Atualiza a contagem de vagas localmente
                    this.vagasDisponiveis = this.vagasDisponiveis > 0 ? this.vagasDisponiveis - 1 : 0;
                    this.erroInscricao = false;
                } else {
                    this.mensagem = 'Falha: Você já está inscrito neste curso ou o login expirou.';
                    this.erroInscricao = true;
                }
            }, 1000);
        },
        voltarAoCatalogo() {
            // Usa o Vue Router para navegar de volta à rota de cursos
            this.$router.push('/cursos'); 
        },
    }
};
</script>

<style scoped>
/* --- Layout e Estrutura --- */
.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.curso-content {
    display: flex;
    gap: 30px;
}

.col-main {
    flex: 3; 
}

.btn-back-link {
    background: none;
    border: none;
    color: var(--color-dark);
    font-size: 1rem;
    cursor: pointer;
    padding: 10px 0;
    margin-bottom: 20px;
    font-weight: 600;
    transition: color 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-back-link:hover {
    color: var(--color-primary); /* Muda para a cor principal no hover */
    transform: translateX(-5px); /* Efeito sutil de movimento */
}

/* Ajusta o título para não ficar colado no botão de voltar */
.title-course {
    /* Mantido o estilo anterior */
    margin-top: 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-dark);
    margin-bottom: 0.5rem;
}

/* NOVO ESTILO: Bloco Principal em Destaque */
.bloco-curso-principal {
    background-color: white; 
    padding: 30px; 
    border-radius: 12px; 
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); /* Destaque sutil */
    height: 100%; /* Garante que o bloco ocupe todo o espaço disponível */
}

.col-sidebar {
    flex: 1; 
    min-width: 300px;
}

/* Títulos e Subtítulos */
.title-course {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-dark);
    margin-bottom: 0.5rem;
}
.subtitle-course {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
}

/* Seções de Detalhes */
.bloco-secao {
    margin-top: 2.5rem; 
}
.secao-titulo {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-dark);
    margin-bottom: 1.2rem;
    border-left: 4px solid var(--color-primary); /* Destaque verde */
    padding-left: 15px; 
}

/* Estilo para a caixa de vagas/ação */
.card-acao {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    position: sticky; 
    top: 5rem; 
}

.info-vagas {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--color-light-bg);
}
.vagas-titulo {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 10px;
}
.vagas-item {
    font-size: 0.95rem;
    margin-bottom: 8px;
}

.vagas-status {
    font-weight: 700;
    margin-top: 15px;
    font-size: 1.1rem;
}
.vagas-status.disponivel {
    color: var(--color-primary);
}
.vagas-status.esgotado {
    color: #cc0000;
}

/* Botão de Ação Principal */
.btn-acao {
    padding: 14px 20px;
    font-size: 1.1rem;
    font-weight: 700;
    transition: background-color 0.3s, opacity 0.3s;
}

/* Feedback de Mensagem */
.feedback-msg {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    font-weight: 500;
    text-align: center;
}
.feedback-msg.success {
    background-color: #e0f8e0;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
}
.feedback-msg.error {
    background-color: #fce8e8;
    color: #cc0000;
    border: 1px solid #cc0000;
}

/* Mobile Responsividade */
@media (max-width: 900px) {
    .curso-content {
        flex-direction: column;
    }
    .col-sidebar {
        min-width: 100%;
        order: -1; 
    }
    .card-acao {
        position: static; 
    }
}
</style>