$(() => {
    const socket = io();

    // Obtaining DOM elements from interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Capture events
    // --> Handle message sending
    $messageForm.submit(e => {
        e.preventDefault();
        console.log('Sending data: ', $messageBox.val());
        socket.emit('send_message', $messageBox.val());
        $messageBox.val('');
    });

    // --> Handle message receipt
    socket.on('new_message', data => {
        console.log('Somebody sent a message: ', data);
        $chat.append(data + '<br />');
    });
});