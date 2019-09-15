$(document).ready(function(e) {


    $('#add-todo').button({ icons: { primary: "ui-icon-circle-plus" } });
    $('#new-todo').dialog({ modal : true, autoOpen : false });
    $('#delete-modal').dialog({ modal : true, autoOpen : false });
    $('#edit-modal').dialog({ modal : true, autoOpen : false });
    


    $('#add-todo').button({
        icons: { primary: "ui-icon-circle-plus" }}).click(
        function() {
        $('#new-todo').dialog('open');
        });

        $('#new-todo').dialog({
            modal : true, autoOpen : false,
            buttons : {
            "Add task" : function () {
                var taskName = $('#task').val();
                var assign = $('#Assign').val();
                if (taskName === '' || assign === '') { return false; }
                var taskHTML = '<li id="draggable"><span class="done">%</span>';
                taskHTML += '<span class="edit">+</span>';
                taskHTML += '<span class="delete">x</span>';
                taskHTML += '<span class="task"></span>';
                taskHTML += '<span class="Assign"></span></li>';
                var $newTask = $(taskHTML);
                $newTask.find('.task').text(taskName);
                $newTask.find('.Assign').text(assign);

                $newTask.hide();
                $('#todo-list').prepend($newTask);
                $newTask.show('clip',250).effect('highlight',1000);
                $(this).dialog('close');
                $('#task').val('');
                $('#Assign').val('');

                $.ajax({
                    method: 'POST',
                    url: "/task/create",
                    data: JSON.stringify({
                        data:{taskName: taskName, username: assign}
                       }),
                       contentType: "application/json",
                       dataType: "json"
                });
            },
            "Cancel" : function () { $(this).dialog('close'); }
            }
            });


    $('#todo-list').on('click', '.done', function() {
        var $taskItem = $(this).parent('li');
        $taskItem.slideUp(250, function() {
        var $this = $(this);
        $this.detach();
        $('#completed-list').prepend($this);
        $this.slideDown();
        });
    });

 

    $(".sortlist").sortable({
        receive: function(event, ui) {
          //do something with the 'draggedItem' here...
          var droppedElemTxt = draggedItem.text();
         // var droppedElemId = draggedItem.attr('id');
         // always item gets dropped and this function is called, so needa make an ajax call from here

         // need to update the completed status using ajax
         // get the id
         var item = $(this).parent('li');
         id = ui.item.context.value; // id
         listType = item.context.id;
         $.ajax({
             method: 'PUT',
             url: '/'+id,
             data: JSON.stringify({
                task:{listType}
                }),
                contentType: "application/json",
                dataType: "json"
         });
        }
        , start: function(e, ui) {
          draggedItem = ui.item;
          var item = $(this).parent('li');
        }
      });

    $('.sortlist').sortable({
        connectWith : '.sortlist',
        cursor : 'pointer',
        placeholder : 'ui-state-highlight',
        cancel : '.delete,.done'
        });

    
        $('.sortlist').on('click','.edit',function() {

            var $itemToEdit = $(this).parent('li');
            $('#edit-modal').dialog('open');
            $('#TaskName').val($itemToEdit.find('.task').text());
            $('#Assigned').val($itemToEdit.find('.Assign').text());
            const id = $(this).parent('li').attr('value');

            $('#edit-modal').dialog({
                modal : true, autoOpen : false,
                buttons : {
                Confirm : function () {
                    var taskName = $('#TaskName').val();
                    var assignedName = $('#Assigned').val();
                    //if (taskName === '' && assignedName === '') { return false; }
                    if(taskName === ''){
                        taskName = $itemToEdit.find('.task').text();
                    }else if(assignedName === ''){
                        assignedName = $itemToEdit.find('.Assign').text()
                    }
                    $itemToEdit.find('.task').text(taskName);
                    $itemToEdit.find('.Assign').text(assignedName);
                    $('#TaskName').val('');
                    $('#Assigned').val('');
                    $(this).dialog('close');

                    $.ajax({
                        method: 'PUT',
                        url: '/task/edit/'+id,
                        data: JSON.stringify({
                           data:{taskName: taskName, username: assignedName},
                           }),
                           contentType: "application/json",
                           dataType: "json"
                    });


                },
                Cancel : function () { $(this).dialog('close'); }
                }
                });
        });

        $('.sortlist').on('click','.delete',function() {

            var $itemToDelete = $(this).parent('li');
            var id= $(this).parent('li').attr('value');

            $('#delete-modal').dialog('open');

            $('#delete-modal').dialog({
                modal : true, autoOpen : false,
                buttons : {
                "Confirm" : function () {
                    $itemToDelete.effect('puff', function() { $(this).remove(); });

                    $(this).dialog('close');
                    deleteTask(id);
                },
                "Cancel" : function () { $(this).dialog('close'); }
                }
                });
        });


        function deleteTask(id){
            $.ajax({
                method: 'DELETE',
                url: '/task/delete/',
                data: JSON.stringify({
                   idNumber:id
                   }),
                   contentType: "application/json",
                   dataType: "json"
            });
        }


        function deleted_func(){

        }

     
  
  
          


}); // end ready