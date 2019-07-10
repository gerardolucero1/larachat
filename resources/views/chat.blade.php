<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sala de chat</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <style>
        .list-group{
            overflow-y: scroll;
            height: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="app" class="row">
            <div class="col-md-4 offset-md-4 offset-sm-1 col-sm-10">
                <li class="list-group-item active">
                    Sala de chat 
                    <span class="badge badge-pill badge-danger">
                        @{{ numberUsers }}
                    </span>
                </li>
                
                <div class="badge badge-pill badge-primary" v-if="typing"> @{{ typing }}</div>
                <ul class="list-group" v-chat-scroll>
                    
                    <message-component 
                        v-for="value, index in chat.message"
                        :key=value.index
                        :color=chat.color[index]
                        :user=chat.user[index]
                        :time=chat.time[index]>
                        @{{ value }}
                    </message-component>

                </ul>
                <input type="text" class="form-control" placeholder="Escribe tu comnetario aqui!" v-model="message" v-on:keyup.enter="send()">   
            </div> 
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.9/push.min.js"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>