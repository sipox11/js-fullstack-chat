$(() => {
    const socket = io();

    // Obtaining DOM elements from interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obtaining DOM elements from nickname form
    const $nicknameForm = $('#nickname-form');
    const $nicknameError = $('#nickname-error');
    const $nickname = $('#nickname');

    // Obtaining DOM elements from user list
    const $users = $('#usernames');

    // Capture events
    // --> Handle message sending
    $messageForm.submit(e => {
        e.preventDefault();
        console.log('Sending data: ', $messageBox.val());
        socket.emit('send_message', $messageBox.val(), data => {
            console.error(data);
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    // --> Handle nickname registration 
    $nicknameForm.submit(e => {
        e.preventDefault();
        $('#nickname-error').hide();
        console.log('Registrating nickname: ', $nickname.val());
        socket.emit('new_user', $nickname.val(), data => {
            if(data) {
                console.log('Success!');
                $('#nickname-wrapper').hide();
                $('#content-wrapper').show();
            } else {
                console.log('Already exists!');
                $('#nickname-error').show();
                $nicknameError.html(`
                <div class="alert alert-danger mt-2">
                    That username already exists!
                </div>
                `);
            }
            $nickname.val('');
        });
    });

    // --> Handle message receipt
    socket.on('new_message', data => {
        console.log('Somebody sent a message: ', data);
        $chat.append(`<strong>${data.nickname}:</strong> ${data.message}<br />`);
    });

    // --> Handle username broadcast
    socket.on('broadcast_usernames', nicknames => {
        console.log(`Received nickname broadcast with data: ${nicknames}`);
        let html = '';
        for (let i = 0; i < nicknames.length; i++) {
            html += `
                <p><i class="fa fa-user"></i> ${nicknames[i]}</p>
            `;
        }
        $users.html(html);
    });

    // --> Handle whisper event (private messages)
    socket.on('whisper', data => {
        console.log('Whisper received: ', data);
        $chat.append(`<p class="whisper"><strong>${data.nickname}:</strong> ${data.message}</p>`);
    })

});