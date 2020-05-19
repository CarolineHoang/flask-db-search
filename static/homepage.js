// Author: Caroline Hoang
// JS for Homepage Search functionality
// at the / route
// [A UI Design Class Assignment]

var ids_to_search = [];
var entries = [];
var salesList = [];

var search = function(search_name){
    var searchVal=search_name.trim();
    if (search_name.length == 0){
        $("#text-warning0").removeClass("hide").addClass("show");
        $("#space-warning0").removeClass("show").addClass("hide");
    }
    else if (searchVal.length != search_name.length && searchVal.length == 0){
        $("#space-warning0").removeClass("hide").addClass("show");
        $("#text-warning0").removeClass("show").addClass("hide");
    }
    else{
        $("#space-warning0").removeClass("show").addClass("hide");
        $("#text-warning0").removeClass("show").addClass("hide");
    }
    var name_to_search = {"name": searchVal};      
    $.ajax({
        type: "POST",
        url: "search",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(name_to_search),
        success: function(result){
            
            ids_to_search = {"search_ids": result["search_ids"]};
            show_producers();
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 

var show_producers = function(){
    $.ajax({
        type: "POST",
        url: "show_producer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(ids_to_search),
        success: function(result2){
            
            display_producer_list(result2["display_producers"])
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
    
    //*********** ------------------  DELETE a sale entry (4.c) --------------------- ************
    $("#search-button").on("click", function(){
        // does not work on dynamically generated objects
        // We must do the following:
        // 1) call the containing div in which the topmost level of nested divs is being 
        //    presented in the actual .html document ("#entries") as the div being clicked
        // 2) use .on() and then use the second parameter to call the div we want to use the click event on  
        // 3) put it in the format [HTML object type].[class name (optional)]
                                                
        //UPDATE MODEL

        $("#space-warning0").removeClass("show").addClass("hide");
        $("#text-warning0").removeClass("show").addClass("hide");

        search($("#search-field").val())
    })

        //*********** ------------------  DELETE a sale entry (4.c) --------------------- ************
    $("#entries").on("click", "button.delete-button", function(){ // ".click()" does not work on dynamically generated objects
                                                                  // We must do the following:
                                                                  // 1) call the containing div in which the topmost level of nested divs is being 
                                                                  //    presented in the actual .html document ("#entries") as the div being clicked
                                                                  // 2) use .on() and then use the second parameter to call the div we want to use the click event on  
                                                                  // 3) put it in the format [HTML object type].[class name (optional)]
                                                
        //UPDATE MODEL
        delete_producer($(this).val());         // "this" refers to the button we clicked

                                            // we had stored the index postion of the row in the entries list as the value so we call this

                                            // since this index should match the index of the position of the data in the json, 
                                            // use this value to call delete_sale, which updates the server model
        //UPDATE VIEW:
        display_producer_list ( salesList ); 
    })
})

//build all the rows seen in the view from the model provided as "entryJSON"

//the structure here is to make a single row with 4 boostrap column divs in it
//each div contains on piece of the information in the JSON and the last column makes the delete-row button

//I did it this way so that if the input values for one input field are very long, 
//the whole row reacts to even itself out height-wise

//SET UP VIEW FOR UPDATE
function makeRowEntries( entryJSON ){
    entries = entryJSON.map(function(s, index){

        var nameDiv = $("<div>" +
                            "<div>" +
                                 "<img src=" + s.profileImg + " class = 'profile-img'/>" + 
                            "</div>" +
                            "<div>" + s.name + "</div>" +
                        "</div>"
                        );
        nameDiv.addClass("col-md-2 starting-column")

        var descDiv = $("<div>" + s.desc + "</div>");
        descDiv.addClass("col-md-5")

        var songNumDiv = $("<div>" + s.songNum + "</div>");
        songNumDiv.addClass("col-md-1")

        var startYearDiv = $("<div>" + s.startYear + "</div>");
        startYearDiv.addClass("col-md-1")

        var vocaloidsDiv = $("<div>" + s.vocaloids + "</div>");
        vocaloidsDiv.addClass("col-md-2")

        var buttonX = $("<button value="+ s.id +">X</button>");  //save index as value
        buttonX.addClass("delete-button")
        var buttonView = $("<button value="+ s.id +">View</button>");  //save index as value
        buttonX.addClass("view-button")
        var buttonViewLink = $("<a href='./view/"+s.id+"'>");
        buttonViewLink.append(buttonView)
        var buttonDiv = $("<div>");
        buttonDiv.append(buttonX, buttonViewLink)
        buttonDiv.addClass("col-md-1 ")

        var rowEntry  = $("<div></div>")
        rowEntry.addClass("row entry-row")
        rowEntry.append(nameDiv , descDiv, songNumDiv,  startYearDiv, vocaloidsDiv, buttonDiv)
        return rowEntry;  
    })
}

//*********** ------------------  UPDATE AND DISPLAY the sales list 4.a) --------------------- ************
//UPDATE THE VIEW
var display_producer_list = function(sales){
    salesList =sales;
    makeRowEntries(salesList); //remake entries array of rows
    $("#entries").empty();   //clear out HTML elements representing old rows before update
    //generate new HTML rows
    if (entries==[] || entries[0]== null ){
        
        // 
        $("#no-results").addClass("appear").removeClass("hide")
    }
    else{
        entries.forEach(function(c){
            $("#no-results").removeClass("appear").addClass("hide")
            $("#entries").prepend(c)
        })
    }
}

//check for only positive integer numbers and 0 with regEx
function isPositiveInteger(strInt) {
    
    return /^(0|[1-9]\d*)$/.test(strInt); // the conditional considers 0, without 0 it would be:
                                          //    return /^[1-9]\d*$/.test(strInt);
}

//*********** ------------------  SAVE an entry  --------------------- ************
var save_sale = function(new_sale){
    var data_to_save = new_sale;      
    $.ajax({
        type: "POST",
        url: "save_sale",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data_to_save),
        success: function(result){
            var sales = result["sales"]
            salesList = sales;
            display_producer_list(display_producers)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 

//*********** ------------------  DELETE an entry  --------------------- ************
var delete_producer = function(sale_id){
    var id_to_delete = {"id": sale_id, "id_list":ids_to_search};      
    $.ajax({
        type: "POST",
        url: "delete_producer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(id_to_delete),
        success: function(result){
            var sales = result["search_ids"]
            salesList = sales;
            show_producers();
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 

$(document).ready(function(){
    // pressing enter to submit the form
    $("#search-field").keyup(function(event){
        if (event.key == "Enter"){
                $("#search-button").click(); //trigger button click event behavior
        }
    })
})