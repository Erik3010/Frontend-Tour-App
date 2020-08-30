<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <div class="modal-header">
                <h1>Login</h1>
                <p>Fill your username and password</p>
            </div>
            <div class="modal-body">
                <div class="item form">
                    <div class="panel-content">
                        <form role="form">
                            <div class="form-group">
                                <label for="">Username:</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    class="input"
                                    v-model="loginData.username"
                                >
                            </div>
                            <div class="form-group">
                                <label for="">Password:</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    class="input"
                                    v-model="loginData.password"
                                >
                            </div>
                            <button
                                type="submit"
                                class="btn btn-submit"
                                @click.prevent="login()"
                            >Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['status'],
    data() {
        return {
            loginData: { username: '', password: '' }
        }
    },
    methods: {
        login() {
            this.$emit('login', this.loginData)
        },
        close() {
            this.$emit('close')
            if(!this.status) {
                this.loginData.username = '';
                this.loginData.password = '';
            }
        }
    }

}
</script>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .modal {
        width: 50%;
        background: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-radius: 10px;
        z-index: 99999;
    }

    .modal-header {
        display: flex;
        text-align: center;
        margin: auto;
        flex-direction: column;
    }

    .modal-header h1,
    .modal-header p {
        margin: 0;
        padding: 0;
    }

    .modal-header p {
        opacity: .7;
    }

    .modal-body {
        margin: 10px 0;
    }
</style>