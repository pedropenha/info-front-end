<template>
    <div class="admin-page">
        <div class="admin-container">
            <div class="page-header">
                <h1 class="page-title">Gerenciar Cursos</h1>
                <router-link to="/admin/cursos/novo" class="btn-add">
                    <iconify-icon icon="hugeicons:book-add" width="20" height="20"></iconify-icon>
                    Novo Curso
                </router-link>
            </div>

            <!-- Filtros -->
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

            <div v-if="isLoading" class="loading">
                Carregando cursos...
            </div>

            <div v-else-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div v-else-if="cursosFiltrados.length === 0" class="empty-state">
                <iconify-icon icon="hugeicons:book-02" width="80" height="80"></iconify-icon>
                <h3>Nenhum curso encontrado</h3>
                <p v-if="filtroAtivo === 'todos'">Comece criando seu primeiro curso!</p>
                <p v-else>Não há cursos {{ filtroAtivo.replace('_', ' ') }}.</p>
            </div>

            <div v-else class="courses-grid">
                <div v-for="curso in cursosFiltrados" :key="curso._id" class="course-card">
                    <div class="course-header">
                        <h3 class="course-name">{{ curso.nome }}</h3>
                        <div class="course-badges">
                            <span :class="['badge', 'badge-status', `badge-${curso.status.toLowerCase()}`]">
                                {{ curso.status }}
                            </span>
                            <span class="badge badge-publico">{{ curso.publico }}</span>
                            <span class="badge badge-vagas">
                                {{ curso.minimoVagas }}-{{ curso.maximoVagas }} vagas
                            </span>
                        </div>
                    </div>

                    <p class="course-description">{{ curso.descricao }}</p>

                    <div class="course-details">
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:teacher" width="18" height="18"></iconify-icon>
                            <div class="instrutores-tags">
                                <span 
                                    v-for="instrutor in curso.instrutores" 
                                    :key="instrutor._id"
                                    class="tag tag-instrutor"
                                >
                                    {{ instrutor.nome }}
                                </span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:location-01" width="18" height="18"></iconify-icon>
                            <span>{{ curso.local }}</span>
                        </div>
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:clock-01" width="18" height="18"></iconify-icon>
                            <span>{{ curso.horario }}</span>
                        </div>
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:user-group" width="18" height="18"></iconify-icon>
                            <span>Faixa Etária: {{ curso.faixaEtaria }}</span>
                        </div>
                    </div>

                    <div class="course-actions">
                        <button @click="viewCourse(curso._id)" class="btn-view" title="Ver Detalhes">
                            <iconify-icon icon="hugeicons:view" width="18" height="18"></iconify-icon>
                            Ver
                        </button>
                        <button @click="editCourse(curso._id)" class="btn-edit" title="Editar">
                            <iconify-icon icon="hugeicons:edit-02" width="18" height="18"></iconify-icon>
                            Editar
                        </button>
                        <button 
                            v-if="!curso.concluido"
                            @click="marcarComoConcluido(curso)" 
                            class="btn-complete" 
                            title="Marcar como Concluído"
                        >
                            <iconify-icon icon="hugeicons:checkmark-circle-02" width="18" height="18"></iconify-icon>
                            Concluir
                        </button>
                        <button 
                            @click="confirmDelete(curso)" 
                            class="btn-delete" 
                            title="Excluir"
                        >
                            <iconify-icon icon="hugeicons:delete-02" width="18" height="18"></iconify-icon>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
                <div class="modal-content" @click.stop>
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir o curso <strong>{{ courseToDelete?.nome }}</strong>?</p>
                    <p class="warning">Esta ação não pode ser desfeita.</p>
                    <div class="modal-actions">
                        <button @click="closeDeleteModal" class="btn-cancel-modal">Cancelar</button>
                        <button @click="deleteCourse" class="btn-confirm-delete">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "AdminListarCursos",
    data() {
        return {
            cursos: [],
            filtroAtivo: 'todos',
            isLoading: true,
            errorMessage: '',
            showDeleteModal: false,
            courseToDelete: null
        };
    },
    computed: {
        cursosFiltrados() {
            if (this.filtroAtivo === 'todos') {
                return this.cursos;
            }
            return this.cursos.filter(curso => {
                const hoje = new Date();
                const dataInicio = new Date(curso.dataInicio);
                const dataTermino = new Date(curso.dataTermino);
                
                if (this.filtroAtivo === 'concluido') {
                    return curso.concluido || hoje > dataTermino;
                } else if (this.filtroAtivo === 'em_andamento') {
                    return !curso.concluido && hoje >= dataInicio && hoje <= dataTermino;
                } else if (this.filtroAtivo === 'vai_iniciar') {
                    return !curso.concluido && hoje < dataInicio;
                }
                return true;
            });
        },
        cursosCount() {
            const hoje = new Date();
            return {
                todos: this.cursos.length,
                em_andamento: this.cursos.filter(c => {
                    const dataInicio = new Date(c.dataInicio);
                    const dataTermino = new Date(c.dataTermino);
                    return !c.concluido && hoje >= dataInicio && hoje <= dataTermino;
                }).length,
                vai_iniciar: this.cursos.filter(c => {
                    const dataInicio = new Date(c.dataInicio);
                    return !c.concluido && hoje < dataInicio;
                }).length,
                concluido: this.cursos.filter(c => {
                    const dataTermino = new Date(c.dataTermino);
                    return c.concluido || hoje > dataTermino;
                }).length
            };
        }
    },
    mounted() {
        this.checkAdminAccess();
        this.loadCourses();
    },
    methods: {
        checkAdminAccess() {
            const user = localStorage.getItem('user');
            if (!user) {
                this.$router.push('/');
                return;
            }

            try {
                const userData = JSON.parse(user);
                if (userData.nivel !== 'admin') {
                    this.$router.push('/cursos');
                }
            } catch (error) {
                this.$router.push('/');
            }
        },

        async loadCourses() {
            this.isLoading = true;
            this.errorMessage = '';

            try {
                const response = await axios.get('http://localhost:3000/api/cursos/', {
                    params: {
                        limit: 100,
                        status: ''  // Empty string to get all courses including completed
                    }
                });
                console.log('Resposta da API:', response.data);
                this.cursos = response.data.cursos || [];
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
                this.errorMessage = 'Erro ao carregar a lista de cursos';
            } finally {
                this.isLoading = false;
            }
        },

        viewCourse(courseId) {
            this.$router.push(`/cursos/${courseId}`);
        },

        editCourse(courseId) {
            this.$router.push(`/admin/cursos/editar/${courseId}`);
        },

        confirmDelete(course) {
            this.courseToDelete = course;
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.courseToDelete = null;
        },

        async deleteCourse() {
            if (!this.courseToDelete) return;

            try {
                await axios.delete(`http://localhost:3000/api/cursos/${this.courseToDelete._id}`);
                
                this.cursos = this.cursos.filter(c => c._id !== this.courseToDelete._id);
                
                this.closeDeleteModal();
            } catch (error) {
                console.error('Erro ao excluir curso:', error);
                alert('Erro ao excluir curso. Tente novamente.');
            }
        },

        async marcarComoConcluido(curso) {
            if (!confirm(`Marcar o curso "${curso.nome}" como concluído?`)) return;

            try {
                const response = await axios.patch(`http://localhost:3000/api/cursos/${curso._id}/concluir`);
                
                const index = this.cursos.findIndex(c => c._id === curso._id);
                if (index !== -1) {
                    this.cursos[index] = response.data;
                }
                
                alert('Curso marcado como concluído com sucesso!');
            } catch (error) {
                console.error('Erro ao marcar curso como concluído:', error);
                alert('Erro ao marcar curso como concluído. Tente novamente.');
            }
        }
    }
};
</script>

<style scoped>
.admin-page {
    min-height: calc(100vh - 120px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem 1rem;
}

.admin-container {
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #133328;
}

.filtros-container {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filtro-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filtro-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: #f0f8f0;
}

.filtro-btn.ativo {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
}

.filtro-btn.ativo iconify-icon {
    color: white;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(78, 158, 71, 0.4);
}

.loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: #666;
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
    color: #4e9e47;
    opacity: 0.3;
    margin-bottom: 1rem;
}

.empty-state h3 {
    font-size: 1.8rem;
    color: #333;
    margin: 1rem 0 0.5rem 0;
}

.empty-state p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.course-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-header {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.course-name {
    margin: 0 0 0.75rem 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
}

.course-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.badge-publico {
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    color: white;
}

.badge-vagas {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
}

.course-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-details {
    margin-bottom: 1rem;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    color: #666;
    font-size: 0.9rem;
}

.detail-row iconify-icon {
    color: #4e9e47;
    flex-shrink: 0;
}

.course-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-view,
.btn-edit,
.btn-delete {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-view {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
}

.btn-view:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-edit {
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    color: white;
}

.btn-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

.btn-delete {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.btn-delete:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: #333;
}

.modal-content p {
    margin: 0.5rem 0;
    color: #666;
}

.warning {
    color: #dc3545;
    font-weight: 600;
    font-size: 0.9rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-cancel-modal,
.btn-confirm-delete {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel-modal {
    background: #f8f9fa;
    color: #333;
    border: 2px solid #e0e0e0;
}

.btn-cancel-modal:hover {
    background: #e9ecef;
}

.btn-confirm-delete {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.btn-confirm-delete:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.badge-status {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
}

.badge-ativo {
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
}

.badge-concluído {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
}

.badge-cancelado {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.btn-complete {
    background: linear-gradient(135deg, #28a745 0%, #218838 100%);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-complete:hover {
    background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

@media (max-width: 768px) {
    .page-title {
        font-size: 1.8rem;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }

    .course-actions {
        flex-direction: column;
    }
}

.instrutores-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag-instrutor {
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
}
</style>
