/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue'

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

var moment = require('moment');

import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css';
Vue.use(Toaster, {timeout: 5000});

Vue.component('message-component', require('./components/MessageComponent.vue').default);


const app = new Vue({
    el: '#app',
    data: {
        message: '',
        chat: {
            message: [],
            user:  [],
            color: [],
            time: [],
        },
        typing: '',
        numberUsers: 0,
    },
    watch: {
        message: function(){
            Echo.private('my_chat')
            .whisper('typing', {
                name: this.message
            });
        }
    },
    methods: {
        send(){
            if(this.message.length != 0){
                this.chat.message.push(this.message);
                this.chat.color.push('success');
                this.chat.user.push('Tu');
                this.chat.time.push(this.getTime());

                axios.post('/send', {
                    message: this.message
                  })
                  .then(response => {
                    console.log(response);
                    this.message = '';
                  })
                  .catch(error => {
                    console.log(error);
                  });
            }
        },

        getTime(){
            moment.localeData('en').relativeTime.s = "just now"
            //let time = new Date();
            let time = moment().fromNow(); 
            //return time.getHours() + ':' + time.getMinutes();
            return time;
        }
    },
    mounted(){
        Echo.private(`my_chat`)
        .listen('ChatEvent', (e) => {
            this.chat.message.push(e.message);
            this.chat.user.push(e.user);
            this.chat.color.push('warning');
            this.chat.time.push(this.getTime());

            Push.create("LaraChat Lucero", { //Titulo de la notificación
                body: e.user + ': ' + e.message, //Texto del cuerpo de la notificación
                icon: 'https://www.stickpng.com/assets/images/5a7880525e772d1dd5e39acf.png', //Icono de la notificación
                timeout: 6000, //Tiempo de duración de la notificación
                onClick: function () {//Función que se cumple al realizar clic cobre la notificación
                    //window.location = "http://localhost:8000/chat"; //Redirige a la siguiente web
                    this.close(); //Cierra la notificación
                }
            });
            //console.log(e);
        })
        .listenForWhisper('typing', (e) => {
            if(e.name != ''){
                this.typing = 'Escribiendo';
            }else{
                this.typing = '';
            }
        })
        Echo.join(`my_chat`)
        .here((users) => {
            this.numberUsers = users.length;
            //console.log(users);
        })
        .joining((user) => {
            this.$toaster.success(user.name + ' se ha unido a la sala de chat! :)');
            this.numberUsers += 1;
            //console.log(user.name);
        })
        .leaving((user) => {
            this.$toaster.error(user.name + ' ha dejado la sala de chat! :(');
            this.numberUsers -= 1;
            //console.log(user.name);
        });
    },
});
