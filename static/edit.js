// Author: Caroline Hoang
// JS functionality for the editing page to edit the biography field (just the one)
// at the /edit/<idVal> route
// [A UI Design Class Assignment]

var ids_to_search = [];

testVal = "hi all"



var update_desc = function(){    
    ids_to_search = {   "search_ids": idVal, 
                        "newDesc": $("#desc-text").val()
                    };
    // ids_to_search.append(idVal)
    $.ajax({
        type: "POST",
        url: "/<"+idVal+">/update_desc",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(ids_to_search),
        success: function(result2){
            
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

//Main program:
$(document).ready(function(){
    $("#update-entry").click(function(){
        update_desc();
    });
})







