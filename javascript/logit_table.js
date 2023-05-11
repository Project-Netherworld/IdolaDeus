/**/
/*
NAME
        add_logit_bias_row() - Adds a row to the logit bias table

SYNOPSIS
        add_logit_bias_row()

DESCRIPTION
        Adds a row to the logit bias table. This will include the columns that contain the word, as well as its bias threshold. 
        Unlike the first row however, it will also contain a button to remove itself. Why doesn't the first row have this option? 
        Redundancy. You could just press a button not to use experimental processors, and removing the first row would make the processing redundant
        and error handling rather annoying.  
RETURNS
        None
*/
/**/

function add_logit_bias_row() {
    let logit_table = document.getElementById("logit-table");
    let new_row = logit_table.insertRow();

    let logit_column = new_row.insertCell();
    let value_column = new_row.insertCell();
    let remove_column = new_row.insertCell();

    logit_column.innerHTML = '<input type="text">';
    value_column.innerHTML = '<input type="number" value = 0 min= -100 max= 100 step=0.01>';

    let remove_button = document.createElement("button");
    remove_button.innerHTML = "Remove";
    remove_button.onclick = function() {
        logit_table.deleteRow(new_row.rowIndex);
    };
    remove_column.appendChild(remove_button);
}