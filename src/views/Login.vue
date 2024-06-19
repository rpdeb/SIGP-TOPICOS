<template>
    <div class="main-container">
        <form>
            <div class="box-container">
                <v-img :src="require('../assets/img/visitantes.jpg')" class="my-1" contain height="110" />
                <h4 class="heading">Olá, visitante</h4>
                <div class="form-fields">
                </div>
                <SocialLogin />
            </div>
        </form>
    </div>
</template>

<script>
//import { required, minLength, email } from "vuelidate/lib/validators";
//import UsersModel from "@/models/UsersModel";
//import ToastMixin from "@/mixins/toastMixin.js";
import SocialLogin from '@/components/SocialLogin'

export default {
    name: 'login',
    components: {
        SocialLogin
    },

    // mixins: [ToastMixin],

    // data() {
    //     return {
    //         form: {
    //             email: "",
    //             password: ""
    //         }
    //     }
    // },

    // validations: {
    //     form: {
    //         email: {
    //             required,
    //             email
    //         },

    //         password: {
    //             required,
    //             minLength: minLength(6),
    //         },
    //     },
    // },

    // methods: {
    //     async login() {
    //         this.$v.$touch();
    //         if (this.$v.$error) return;

    //         let user = await UsersModel.params({ email: this.form.email }).get();

    //         if (!user || !user[0] || !user[0].email) {
    //             this.showToast("danger", "Erro!", "Usuário e/ou senha incorretos");
    //             this.clearForm();
    //             return;
    //         }

    //         user = user[0];
    //         if (user.password !== this.form.password) {
    //             this.showToast("danger", "Erro!", "Usuário e/ou senha incorretos");
    //             this.clearForm();
    //             return;
    //         }

    //         localStorage.setItem('authUser', JSON.stringify(user));
    //         this.$router.push({ name: "list" });
    //     },

    //     clearForm() {
    //         this.form = {
    //             email: "",
    //             password: ""
    //         }
    //     },

    //     getValidation(field) {
    //         if (this.$v.form.$dirty === false) {
    //             return null;
    //         }

    //         return !this.$v.form[field].$error;
    //     },

    //     goToRegister() {
    //         this.$router.push({ name: "register" });
    //     }
    // },
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
