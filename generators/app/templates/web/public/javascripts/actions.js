$(document).on(
    'click',
    'button#buttonDeleteItem',
    function() {
        console.log('actions.js -> input#buttonDeleteItem click handler invoked');
        $.ajax({
            url: '/item',
            type: 'delete',
            dataType: 'json',
            data: $('form#formDeleteItem').serialize(),
            success: function() {
                console.log('actions.js -> $.ajax call for deleteItem successful');
                location.reload();
            }
        });
    }
);
