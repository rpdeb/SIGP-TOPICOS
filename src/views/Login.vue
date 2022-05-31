<template>
    <v-row class="vh-100 vw-100 row-login">
        <v-col sm="5" class="d-flex justify-content-center align-items-center left-login">

            <div class="col-8">
                <h2 class="text-center mv-5 title-login">Faça o login</h2>
                <v-form>
                    <v-text-field label="E-mail:" label-for="email">
                        <v-form id="email" type="email" placeholder="joaosilva@email.com" autocomplete="off"
                            v-model.trim="$v.form.email.$model" :state="getValidation('email')"></v-form>
                    </v-text-field>

                    <v-text-field label="Senha:" label-for="password">
                        <label class="d-flex justify-content-between">
                            Senha

                            <small><a href="#">Esqueceu sua senha?</a></small>
                        </label>
                        <v-form id="password" type="password" placeholder="Digite aqui a sua senha"
                            v-model.trim="$v.model.password.$model" :state="getValidation('password')"></v-form>
                    </v-text-field>

                    <v-btn
                        type="button"
                        color="success"
                        block
                        variant="primary" 
                        @click="login">
                        <i class="fas fa-sign-in-alt"></i>Entrar
                    </v-btn>
                </v-form>
            </div>

        </v-col>
        
        <v-col sm="7" class="side-login d-flex justify-content-center align-items-center">
            <img src="../assets/images/login.svg" class="img-login" />
        </v-col>
    </v-row>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import UsersModel from "@/models/UsersModel";
import ToastMixin from "@/mixins/toastMixin.js";

export default {
    mixins: [ToastMixin],

    data() {
        return {
            form: {
                email: "",
                password: ""
            }
        }
    },

    validations: {
        form: {
            email: {
                required,
                email
            },

            password: {
                required,
                minLength: minLength(6),
            },
        },
    },

    methods: {
        async login() {
            this.$v.$touch();
            if (this.$v.$error) return;

            let user = await UsersModel.params({ email: this.form.email }).get();

            if (!user || !user[0] || !user[0].email) {
                this.showToast("danger", "Erro!", "Usuário e/ou senha incorretos");
                this.clearForm();
                return;
            }

            user = user[0];
            if (user.password !== this.form.password) {
                this.showToast("danger", "Erro!", "Usuário e/ou senha incorretos");
                this.clearForm();
                return;
            }

            localStorage.setItem('authUser', JSON.stringify(user));
            this.$router.push({ name: "list" });
        },

        clearForm() {
            this.form = {
                email: "",
                password: ""
            }
        },

        getValidation(field) {
            if (this.$v.form.$dirty === false) {
                return null;
            }

            return !this.$v.form[field].$error;
        },

        goToRegister() {
            this.$router.push({ name: "register" });
        }
    },
}
</script>

<style>
*,
*:after,
*:before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
}

.row-login {
    margin-left: 0 !important;
}

.img-login {
    width: 580px;
    height: 580px;
}

.left-login {
    background-color: #f2f2f2;
}

.title-login {
    font-weight: bold;
}
</style>
