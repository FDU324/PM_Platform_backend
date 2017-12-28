var onlineUserTable = {}

module.exports = function (httpServer) {
    var io = require('socket.io')(httpServer, {
        transports: ['polling', 'websocket']
    });

    io.sockets.on('connection', (socket) => {
        console.log('a user connected: ' + socket.id);

        socket.on('confirmConnect', (data, func) => {
            //socket.emit('loginSuccess', 'success');
            console.log('confirm');
            func({
                success: true,
                data: 'success'
            });
        });

        /*  登录  */
        socket.on('login', (username, func) => {
            /*  用户顶替  */
            if (onlineUserTable[username]!=null) {
                onlineUserTable[username].emit('logout');
            }
            
            onlineUserTable[username] = socket;
            func({
                success: true,
                data: 'success'
            });
            console.log(
                username, ' login');

        });

        // 前台断开socket连接
        socket.on('disconnect', () => {
            let username;
            for (let [k, v] of Object.entries(onlineUserTable)) {
                if (v === socket) {
                    username = k;
                }
            }
            onlineUserTable[username] = null;
            console.log(username+' disconnected');
        });

        // 登出
        socket.on('logout', (username, func) => {
            onlineUserTable[username] = null;
            func({
                success: true,
                data: 'success'
            });
            console.log(username, ' logout');
        });

 

        /*  聊天  */
        socket.on('sendMessage', (data, func) => {
            console.log("message:\n"+data);
            let jsonData = JSON.parse(data);

            if(onlineUserTable[jsonData.to] == null) {
                func({
                    success: false,
                    data: '好友未在线'
                });
            }
            else {
                onlineUserTable[jsonData.to].emit('newMessage', data);
                func({
                    success: true,
                    data: 'success'
                });
            }

        });
    });

}

module.exports.onlineUserTable = onlineUserTable;
    