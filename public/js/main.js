$(document).ready(function(){
    $('.delete-recipe').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete recipe?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting recipe...');
                    window.location.href = '/';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $('.edit-recipe').on('click', function(){
        // Handle edit recipe functionality
        $('#edit-form-name').val($(this).data('name'));
        $('#edit-form-ingredients').val($(this).data('ingredients'));
        $('#edit-form-directions').val($(this).data('directions'));
        $('#edit-form-id').val($(this).data('id'));

    });
});
