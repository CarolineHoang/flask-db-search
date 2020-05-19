// Author: Caroline Hoang
// JS functionality for the creation page to create a new item for the database
// at the /create route
// [A UI Design Class Assignment]

var vocaloids_to_add = [];
var lastId;

//check for only positive integer numbers and 0 with regEx
function isPositiveInteger(strInt) {
    return /^(0|[1-9]\d*)$/.test(strInt); // the conditional considers 0, without 0 it would be:
                                          //    return /^[1-9]\d*$/.test(strInt);
}

//*********** ------------------  SAVE a sale entry (4.b) --------------------- ************
var save_producer = function(new_sale){
    var data_to_save = new_sale;      
    $.ajax({
        type: "POST",
        url: "save_producer",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data_to_save),
        success: function(result){
            $("#failure").addClass("hide").removeClass("show")
            lastId = result["idVal"];
            
            $("#view-new").attr("href", "/view/"+lastId);
            $("#view-entry").removeClass("hide").addClass("show");
        },
        error: function(request, status, error){
            $("#failure").addClass("show").removeClass("hide")
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
} 

//Main program:
$(document).ready(function(){
    
    //ADD an entry
    $("#add-entry").click(function(){
    
        //variables to update with
        var name = $("#name-input").val() 
        var startYear = $("#startYear-input").val()
        var songNum = $("#songNum-input").val()
        var desc = $("#desc-input").val()
        // var vocaloids= $("#vocaloids-input").val()
        var profileImg= $("#profileImg-input").val()
        var textInputs = [name, desc, profileImg].reverse();
        var intInputs = [startYear, songNum].reverse();

        //deactivate all warnings
        $("#text-warning1").removeClass("show").addClass("hide")
        $("#text-warning2").removeClass("show").addClass("hide")
        $("#text-warning3").removeClass("show").addClass("hide")
        $("#text-warning4").removeClass("show").addClass("hide")
        $("#space-warning1").removeClass("show").addClass("hide")
        $("#space-warning2").removeClass("show").addClass("hide")
        $("#space-warning3").removeClass("show").addClass("hide")
        $("#space-warning4").removeClass("show").addClass("hide")
        $("#num-warning0").removeClass("show").addClass("hide")
        $("#num-warning1").removeClass("show").addClass("hide")


        //if both fields have valid input, update model and then the view
        if (  /*true || */( (((name).trim()).length != 0)  && (((desc).trim()).length != 0) && (((profileImg).trim()).length != 0)&& (startYear.length != 0 )&& (songNum.length != 0 )) 
                                   && (isPositiveInteger(startYear.trim()) ) && (isPositiveInteger(songNum.trim()) ) 
                                   && (vocaloids_to_add.length > 0)      ){  //we trim so we can accept numbers with starting spaces
            
            //*********** ------------------  SAVE an entry  --------------------- ************

            //UPDATE MODEL:
            //add a new "row" of information to saleslist JSON list
            save_producer(                
                {
                    "name": name,
                    "startYear": parseInt(startYear,  10),
                    "songNum": parseInt(songNum,  10),
                    "desc": desc,
                    "vocaloids": vocaloids_to_add, // vocaloids,
                    "profileImg": profileImg
                }
            )

            //clear input values when values passed
            $("#name-input").val("");
            $("#desc-input").val("");
            $("#startYear-input").val("");
            $("#songNum-input").val("");
            $("#vocaloids-input").val("");
            $("#profileImg-input").val("");
            $("#entries").html("");
            vocaloids_to_add =[];

            //put focus back on the the #name-input field
            $("#name-input").focus();
        }

        else{
            //handle the display of warnings
            //note, the name group is on the bottom so it will fire last and take priority if they are both wrong

            //handle all error displays pertaining to and put focus on #number fields
            //if num field is empty is not a valid, positive integer or zero
            iInLen = intInputs.length-1
            intInputs.forEach(function(x, i){
                
                if ((x.length)==0 || !isPositiveInteger(x.trim()) ) {
                    $("#num-warning"+(iInLen-i)).removeClass("hide").addClass("show")
                    $("#num-warning"+(iInLen-i)).focus();
                }
                //#num field is correct, remove all error displays
                else{
                    $("#num-warning"+(iInLen-i)).removeClass("show").addClass("hide")
                }
                
            })
            tInLen = textInputs.length-1
            textInputs.forEach(function(y, j){
                
                if (y.length === 0) {
                    $("#text-warning"+(tInLen-j)).removeClass("hide").addClass("show")
                    $("#space-warning"+(tInLen-j)).removeClass("show").addClass("hide")
                    $("#text-warning"+(tInLen-j)).focus();
                }
                else if ((y.trim()).length === 0) {
                    $("#space-warning"+(tInLen-j)).removeClass("hide").addClass("show")
                    $("#text-warning"+(tInLen-j)).removeClass("show").addClass("hide")
                    $("#text-warning"+(tInLen-j)).focus();
                }
                else{
                    $("#text-warning"+(tInLen-j)).removeClass("show").addClass("hide")
                    $("#space-warning"+(tInLen-j)).removeClass("show").addClass("hide")
                }
                
            })
            if (vocaloids_to_add.length<=0){
                $("#array-warning0").removeClass("hide").addClass("show");
            }
            else{
                $("#array-warning0").removeClass("show").addClass("hide")
            }
        } 
    })
    $("#add-vocaloid").click(function(){
        
        vocaloidInputField = $("#vocaloids-input").val()

        if (vocaloidInputField.length === 0) {
            $("#arr-text-warning"+0).removeClass("hide").addClass("show")
            $("#arr-space-warning"+0).removeClass("show").addClass("hide")
            $("vocaloids-input").focus();
        }
        else if ((vocaloidInputField.trim()).length === 0) {
            $("#arr-space-warning"+0).removeClass("hide").addClass("show")
            $("#arr-text-warning"+0).removeClass("show").addClass("hide")
            $("vocaloids-input").focus();
        }
        else{
            $("#arr-text-warning"+0).removeClass("show").addClass("hide")
            $("#arr-space-warning"+0).removeClass("show").addClass("hide")
            $("#array-warning0").removeClass("show").addClass("hide")
    
            vocaloids_to_add.push($("#vocaloids-input").val());
            var renderedVoca = vocaloids_to_add.map(function(v, index){
                
                var value = $("<div>"+v+"</div>").addClass("col-md-2") 
                var row = ($("<li id='vRow"+index+"'></li>").addClass("row")).append( value, $("<button id='vbutton"+index+"' value="+index+">X</button>").addClass("col-md-1 voca-delete-button"))
                return row;
            });
            $("#entries").empty();
            renderedVoca.forEach(function (v1){
                $("#entries").append(v1)
            })
            $("#vocaloids-input").val("");
        }
    });
    $("#entries").on("click", "button.voca-delete-button",function(){
        $("#vRow"+$(this).val()).remove()
        vocaloids_to_add.splice($(this).val(),1)
    });
})

$(document).ready(function(){
    // pressing enter to submit the form
    $("#vocaloids-input").keyup(function(event){
        if (event.key == "Enter"){
            $("#add-vocaloid").click(); //trigger button click event behavior
        }
    })
})