var onlineUserTable = {}



module.exports = function(httpServer) {
    let io = require('socket.io')(httpServer);

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

            /*  处理离线信息  */
            // Message.find({
            //     to: username
            // }).then(tems => {
            //     let allTemMessage = tems.map(tem => {
            //         return socket.emit('receiveMessage', tem.message);

            //     });

            //     Promise.all(allTemMessage).then(data => {
            //         console.log('temmessage broadcasted');

            //         /*  删除已发送的离线信息  */
            //         Message.destroy({
            //             to: username
            //         }).then(() => {
            //             console.log('temmessage deleted');
            //         });
            //     });
            // });
            // Friend.find({
            //     friendUsername: username
            // }).then(tems => {
            //     let allTemMessage = tems.map(tem => {
            //         var request = {
            //             Username: tem.from    
            //         }
            //         var sessionTicket = null;
            //         for (var i=0;i<=req.session.num;i++) {
            //             //console.log(req.session.playerMap[i].username);
            //             if (req.session.playerMap[i].username==values.username) {
            //                 console.log(values.username);
            //                 sessionTicket = req.session.playerMap[i].session_ticket;
            //             }   
            //         }
            //         PlayFabAPI._internalSettings.sessionTicket = sessionTicket;
            //         PlayFabClientAPI.GetAccountInfo(
            //             request,
            //             OnGetAccountResult
            //         );
            //         function OnGetAccountResult(error,result) {
            //             if (error==null) {
            //                 //res.send(result.data);
            //                 var user_PlayFabId = result.data.AccountInfo.PlayFabId;
            //                 var request = {
            //                     PlayFabId : user_PlayFabId
            //                 }
            //                 PlayFabClientAPI.GetAccountInfo(
            //                     request,
            //                     OnGetUserResult
            //                 );
            //                 function OnGetUserResult(err_OnGetUser,res_OnGetUser) {
            //                     if (err_OnGetUser==null) {
            //                         user = {
            //                             username: res_OnGetUser.data.AccountInfo.Username,
            //                             email: res_OnGetUser.data.PrivateInfo.email,
            //                             nickname: res_OnGetUser.data.TitleInfo.DisplayName
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         return socket.emit('receiveFriendReq', JSON.stringify(user));

            //     });

            //     Promise.all(allTemMessage).then(data => {
            //         console.log('message broadcasted');
            //         /*  删除已发送的离线信息  */
            //         Friend.destroy({
            //             friendUsername: username
            //         }).then(() => {
            //             console.log('message deleted');
            //         });
            //     });
            // });
                    /*  离线好友请求  */
                    /*if (tem.type === 'friend') {
                        return User.findOne({
                            where: {username: tem.content},
                            attributes: ['username', 'nickname', ['userImage', 'userimage'], 'location']
                        }).then(user => {
                            return socket.emit('receiveFriendReq', JSON.stringify(user));
                        })
                    }*/
                    /*  离线聊天信息  */
                    /*else if (tem.type === 'message') {
                        return socket.emit('receiveMessage', tem.content);
                    }*/
                    /*  离线动态  */
                    /*else if (tem.type === 'moment') {
                        return returnMoment(tem.content, username).then(moment => {
                            return socket.emit('receiveMoment', JSON.stringify(moment));
                        });
                    }*/
                    /*  离线动态删除  */
                    /*else if (tem.type === 'momentDelete') {
                        return socket.emit('deleteMoment', tem.content);
                    }*/
                    /*  离线好友确认  */
                    /*else if (tem.type === 'acceptFriend') {
                        return User.findOne({
                            where: {username: tem.content},
                            attributes: ['username', 'nickname', ['userImage', 'userimage'], 'location']
                        }).then(user => {
                            return socket.emit('friendReqAssent', JSON.stringify(user));
                        })
                    }*/

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

        /*  好友请求  */
        socket.on('friendReq', (data, func) => {
            let username = JSON.parse(data);
            console.log(username.friendUsername);
            if (onlineUserTable[username.friendUsername]) {
                User.findOne({
                    where: {username: username.myUsername},
                    attributes: ['username', 'nickname', ['userImage', 'userimage'], 'location']
                }).then((user) => {
                    onlineUserTable[username.friendUsername].emit('receiveFriendReq', JSON.stringify(user));
                }).catch((err) => {
                    console.log('err:', err);
                });
            } else {
                /*  离线处理  */
                TemMessage.create({
                    to: username.friendUsername,
                    type: 'friend',
                    content: username.myUsername,
                }).then(function () {
                    console.log('temp friend created');
                }).catch(function (err) {
                    console.log('failed: ' + err);
                });
            }
            func({
                success: true,
                data: 'success'
            });
        });

        /*  同意好友请求  */
        socket.on('acceptFriendReq', (data, func) => {
            let username = JSON.parse(data);
            /*  数据库新建好友  */
            Friend.create({
                first: username.friendUsername,
                second: username.myUsername
            }).then(() => {
                func({
                    success: true,
                    data: 'success'
                });

                User.findOne({
                    where: {username: username.myUsername},
                    attributes: ['username', 'nickname', ['userImage', 'userimage'], 'location']
                }).then((user) => {
                    if (onlineUserTable[username.friendUsername]) {
                        onlineUserTable[username.friendUsername].emit('friendReqAssent', JSON.stringify(user));
                    } else {
                        /*  离线处理  */
                        TemMessage.create({
                            to: username.friendUsername,
                            type: 'acceptFriend',
                            content: username.myUsername,
                        }).then(function () {
                            console.log('temp acceptFriend created');
                        });
                    }
                })
            }).catch(err => {
                console.log('err:', err);
                func({
                    success: false,
                    data: err
                });
            });
        });

        /*  删除好友  */
        socket.on('deleteFriend', (data, func) => {
            let username = JSON.parse(data);
            /*  数据库删除好友  */
            Friend.destroy({
                where: {
                    $or: [
                        {first: username.friendUsername, second: username.myUsername},
                        {first: username.myUsername, second: username.friendUsername}
                    ]
                },
                attributes: ['username', 'nickname', ['userImage', 'userimage'], 'location']
            }).then(() => {
                console.log("friend deleted " + username.myUsername);
                func({
                    success: true,
                    data: 'success'
                });
            }).catch(err => {
                console.log('err:', err);
                func({
                    success: false,
                    data: err
                });
            });
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
    