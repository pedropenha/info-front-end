<template>
    <div class="admin-page">
        <div class="admin-container">
            <div class="page-header">
                <h1 class="page-title">Gerenciar Usuários</h1>
                <router-link to="/admin/usuarios/novo" class="btn-add">
                    <iconify-icon icon="hugeicons:user-add-01" width="20" height="20"></iconify-icon>
                    Novo Usuário
                </router-link>
            </div>

            <div v-if="isLoading" class="loading">
                Carregando usuários...
            </div>

            <div v-else-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div v-else-if="usuarios.length === 0" class="empty-state">
                <iconify-icon icon="hugeicons:user-multiple" width="80" height="80"></iconify-icon>
                <h3>Nenhum usuário encontrado</h3>
                <p>Comece criando o primeiro usuário!</p>
                <router-link to="/admin/usuarios/novo" class="btn-add">
                    <iconify-icon icon="hugeicons:user-add-01" width="20" height="20"></iconify-icon>
                    Cadastrar Primeiro Usuário
                </router-link>
            </div>

            <div v-else class="users-grid">
                <div v-for="user in usuarios" :key="user._id" class="user-card">
                    <div class="user-header">
                        <img 
                            :src="user.foto || defaultAvatar" 
                            :alt="user.nome"
                            class="user-photo"
                        />
                        <div class="user-info">
                            <h3 class="user-name">{{ user.nome }}</h3>
                            <span class="user-badge" :class="'badge-' + user.nivel">
                                {{ user.nivel }}
                            </span>
                        </div>
                    </div>

                    <div class="user-details">
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:mail-01" width="18" height="18"></iconify-icon>
                            <span>{{ user.email }}</span>
                        </div>
                        <div class="detail-row">
                            <iconify-icon icon="hugeicons:user-id-verification" width="18" height="18"></iconify-icon>
                            <span>{{ user.cpf }}</span>
                        </div>
                        <div v-if="user.proficiencias && user.proficiencias.length > 0" class="detail-row">
                            <iconify-icon icon="hugeicons:stars" width="18" height="18"></iconify-icon>
                            <div class="proficiencias-tags">
                                <span 
                                    v-for="(prof, index) in user.proficiencias.slice(0, 3)" 
                                    :key="index"
                                    class="prof-tag"
                                >
                                    {{ prof }}
                                </span>
                                <span v-if="user.proficiencias.length > 3" class="prof-tag prof-more">
                                    +{{ user.proficiencias.length - 3 }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="user-actions">
                        <button @click="editUser(user._id)" class="btn-edit" title="Editar">
                            <iconify-icon icon="hugeicons:edit-02" width="18" height="18"></iconify-icon>
                            Editar
                        </button>
                        <button 
                            @click="confirmDelete(user)" 
                            class="btn-delete" 
                            title="Excluir"
                            :disabled="user._id === currentUserId"
                        >
                            <iconify-icon icon="hugeicons:delete-02" width="18" height="18"></iconify-icon>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de Confirmação -->
            <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
                <div class="modal-content" @click.stop>
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir o usuário <strong>{{ userToDelete?.nome }}</strong>?</p>
                    <p class="warning">Esta ação não pode ser desfeita.</p>
                    <div class="modal-actions">
                        <button @click="closeDeleteModal" class="btn-cancel-modal">Cancelar</button>
                        <button @click="deleteUser" class="btn-confirm-delete">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "AdminListarUsuarios",
    data() {
        return {
            usuarios: [],
            isLoading: true,
            errorMessage: '',
            showDeleteModal: false,
            userToDelete: null,
            currentUserId: null,
            defaultAvatar: 'https://via.placeholder.com/80x80/4e9e47/ffffff?text=U'
        };
    },
    mounted() {
        this.checkAdminAccess();
        this.getCurrentUserId();
        this.loadUsers();
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

        getCurrentUserId() {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    this.currentUserId = userData._id || userData.id;
                } catch (error) {
                    console.error('Erro ao obter ID do usuário atual:', error);
                }
            }
        },

        async loadUsers() {
            this.isLoading = true;
            this.errorMessage = '';

            try {
                const response = await axios.get('http://localhost:3000/api/users/');
                this.usuarios = response.data.data || [];
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                this.errorMessage = 'Erro ao carregar a lista de usuários';
            } finally {
                this.isLoading = false;
            }
        },

        editUser(userId) {
            // Navegar para página de edição (pode ser implementada depois)
            this.$router.push(`/admin/usuarios/editar/${userId}`);
        },

        confirmDelete(user) {
            this.userToDelete = user;
            this.showDeleteModal = true;
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.userToDelete = null;
        },

        async deleteUser() {
            if (!this.userToDelete) return;

            try {
                await axios.delete(`http://localhost:3000/api/users/${this.userToDelete._id}`);
                
                // Remover da lista
                this.usuarios = this.usuarios.filter(u => u._id !== this.userToDelete._id);
                
                this.closeDeleteModal();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário. Tente novamente.');
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
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #133328;
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

.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.user-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.user-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.user-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #4e9e47;
}

.user-info {
    flex: 1;
}

.user-name {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
}

.user-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.badge-admin {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.badge-professor {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    color: white;
}

.badge-user {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
}

.user-details {
    margin-bottom: 1rem;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: #666;
    font-size: 0.95rem;
}

.detail-row iconify-icon {
    color: #4e9e47;
    flex-shrink: 0;
}

.proficiencias-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.prof-tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: #e8f5e9;
    color: #2e7d32;
    border-radius: 4px;
    font-size: 0.8rem;
}

.prof-more {
    background: #4e9e47;
    color: white;
    font-weight: 600;
}

.user-actions {
    display: flex;
    gap: 0.5rem;
}

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

.btn-delete:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-delete:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

@media (max-width: 768px) {
    .page-title {
        font-size: 1.8rem;
    }

    .users-grid {
        grid-template-columns: 1fr;
    }
}
</style>
