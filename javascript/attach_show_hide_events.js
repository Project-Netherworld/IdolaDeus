attach_show_hide_events()


/**/
/*
NAME
        attach_show_hide_events() - Assigns the bulk of showing and hiding events to certain dropdown menus and checkboxes.

SYNOPSIS
        attach_show_hide_events()

DESCRIPTION
        This function is mostly just a means to assign showing and hiding events. Why? UI, for the most part, as the settings builder is 
        cluttered as is, so it would be better if a user can just ignore settings they're not interested in. Not very interesting outside 
        of certain lambda functions that will be documented below. One thing to note however, is the following that will become ubiquitous 
        throughout this program: the fact that many of the functions are nested when being assigned to. Why? This is the only way to avoid them
        only being called once at runtime, and there's not much better of a solution I could find.
RETURNS
        None
*/
/**/
function attach_show_hide_events() {
    
    // Events related to Netherworld Settings 
    let memory_cycler_select = document.getElementById("memory_cycler_select");
    let extra_budget = document.getElementById("extra_budget");
    memory_cycler_select.addEventListener("change", function(){ show_or_hide_based_on_option(memory_cycler_select, extra_budget, "none", true)})
    
    let device_select = document.getElementById("device_select");
    let gpu_number = document.getElementById("GPU_number");
    // Ugly, but I need to use this to make sure the function fires only once and not immeadiately. 
    // Remember this for the rest of the part of the function and beyond.
    device_select.addEventListener("change", function(){ show_or_hide_based_on_option(device_select, gpu_number, "cuda:")})


    // Events related to Provider Settings 
    let provider_selection = document.getElementById("provider_type")
    let discord_elements = document.getElementsByClassName("discord_exclusive")
    provider_selection.addEventListener("change", function(){ show_hide_multiple(provider_selection, discord_elements, "discord")})

    
    let status_selection = document.getElementById("status_type")
    let status_body = document.getElementById("status_body")
    status_selection.addEventListener("change", function(){ show_or_hide_based_on_option(status_selection, status_body, "none", true,"inner_hide")})

    let conditional_response_selection = document.getElementById("conditional_response")
    let bot_nicknames = document.getElementById("bot_nicknames")
    let bot_nicknames_input = document.getElementById("bot_nicknames_input")
    conditional_response_selection.addEventListener("click", function(){ 
        
        if (conditional_response_selection.checked == true) {
            bot_nicknames.classList.remove("inner_hide")
            bot_nicknames_input.required = true
        }
        else {
            bot_nicknames.classList.add("inner_hide")
            bot_nicknames_input.required = false
        }
            
        
    })


    // All Show/Hide events related to Generation Settings 
    let recommend_sampler_selection = document.getElementById("sampler_recommend")
    let sampler_elements = document.getElementsByClassName("sampler_exclusive")
    recommend_sampler_selection.addEventListener("click", function(){ show_or_hide_based_on_checked(recommend_sampler_selection, sampler_elements)})

    let recommend_syntax_selection = document.getElementById("syntax_recommend")
    let syntax_elements = document.getElementsByClassName("syntax_exclusive")
    recommend_syntax_selection.addEventListener("click", function(){ show_or_hide_based_on_checked(recommend_syntax_selection, syntax_elements)})

    //Events relating to Input Settings. 
    let advanced_response_selection = document.getElementById("advanced_checked")
    let advanced_prompt = document.getElementById("advanced_prompt")
    let basic_prompt = document.getElementById("basic_prompt")

    // Lambda function that either shows or hides the advanced or basic prompt based on one another. 
    advanced_response_selection.addEventListener("click", function(){ 
        if (advanced_response_selection.checked == true) {
            advanced_prompt.classList.remove("hide")
            basic_prompt.classList.add("hide")
        }
        else {
            advanced_prompt.classList.add("hide")
            basic_prompt.classList.remove("hide")
        
        }
    })
    
    // Events related to Experimental Settings
    let warper_syntax_selection = document.getElementById("warper_recommend")
    let warper_elements = document.getElementsByClassName("warper_exclusive")
    warper_syntax_selection.addEventListener("click", function(){ show_or_hide_based_on_checked(warper_syntax_selection, warper_elements)})

    let processor_syntax_selection = document.getElementById("processor_recommend")
    let processor_elements = document.getElementsByClassName("processor_exclusive")
    processor_syntax_selection.addEventListener("click", function(){ show_or_hide_based_on_checked(processor_syntax_selection, processor_elements)})
    
    // Here, the lambda function basically allows to have a show/hide event based on check marks next to all sorts of generation settings,
    // syntax, sampler, experimental warpers, etc.. If checked, they will have a number input box and range input alongside it. 
    let option_check_elements = document.getElementsByClassName("option_check")
    for (option_element_itr = 0; option_element_itr < option_check_elements.length; option_element_itr++ ) {
        let element_to_add_event = option_check_elements[option_element_itr]
        element_to_add_event.addEventListener("click", function(){ show_or_hide_generation_setting(element_to_add_event) })
    } 
}


/**/
/*
NAME
        show_hide_multiple() - Shows or hides multiple elements based on a string value. Used mostly for drop-downs.

SYNOPSIS
        show_hide_multiple(a_selection_element, a_show_or_hide_elements, a_string_val)
            a_selection_element -> The input dropdown element. It's called selection as the 
                function literally selects it from the document to exploit it. 
            a_show_or_hide_elements -> The elements to show or hide. This is a list. 
            a_string_val -> The value that determines whether or not to show or hide events. String. 

DESCRIPTION
        Namely, this function is used to show or hide multiple elements based on drop-down menus. For instance, if the user selects 'discord'
        as their provider, all the discord elements here are passed and will be shown. 
RETURNS
        None
*/
/**/
function show_hide_multiple(a_selection_element, a_show_or_hide_elements, a_string_val) {
    for (let iterator = 0; iterator < a_show_or_hide_elements.length; iterator++) {
        show_or_hide_based_on_option(a_selection_element, a_show_or_hide_elements[iterator], a_string_val);
    }
}


/**/
/*
NAME
        show_or_hide_generation_setting() - Shows or hides the input numeric value and range for a generation setting based on
        if it's checked or not. 

SYNOPSIS
        show_or_hide_generation_setting(a_setting_check_mark)
            a_setting_check_mark -> The checkbox element for which to see if its checked.

DESCRIPTION
        This function is most commonly used by sampler esque options, as they have both a numeric based input as well as a range input.
        These of course, only appear when their corresponding checkbox is checked. 
RETURNS
        None
*/
/**/
function show_or_hide_generation_setting(a_setting_check_mark) {
    let setting_input_box = a_setting_check_mark.nextElementSibling
    let range_input_box = setting_input_box.nextElementSibling    
    if (a_setting_check_mark.checked == true) {
        setting_input_box.classList.remove("inner_hide")

        if (range_input_box) {
            range_input_box.classList.remove("inner_hide")
            range_input_box.style.display = "inline-block"
        }
        
    }
    else {
        setting_input_box.classList.add("inner_hide")
        if (range_input_box) {
            range_input_box.classList.add("inner_hide")
        }
    }
}

/**/
/*
NAME
        show_or_hide_based_on_checked() - Show or hide element(s) based on if another element is checked. 

SYNOPSIS
        show_or_hide_based_on_checked(checked_element, show_or_hide_elements)
            checked_element -> The checkbox element for which to see if its checked.
            show_or_hide_elements -> The elements to be shown or hidden based on the checkbox. 

DESCRIPTION
        This function shows or hides element(s) based on if another is checked by doing a passthrough to the show_hide_multiple function.
        Also assigns the value of the checkbox so its easier to parse for further functions. 
RETURNS
        None
*/
/**/
function show_or_hide_based_on_checked(a_checked_element, a_show_or_hide_elements) {
    if(a_checked_element.checked == true) {
        a_checked_element.value = "true"
    }
    else {
        a_checked_element.value = "false"
    }
    show_hide_multiple(a_checked_element, a_show_or_hide_elements, "false")
}

/**/
/*
NAME
        show_or_hide_based_on_option() - Show or hide an element based on a dropdown menu.  

SYNOPSIS
         show_or_hide_based_on_option(selection_element, show_or_hide_element, 
                                    string_val, inverted = false, hider_class = "hide")
            a_selection_element -> the element of which value will be extracted for comparison. Almost always a dropdown.
            a_show_or_hide_element -> the element to show or hide, typically has a group of inputs. 
            a_string_val-> The string value of which to compare against. String.
            a_inverted-> Whether or not to invert the comparison. For example, if status_body is equal to None, we invert the 
                conditional so as to show all the other elements. bool. 
            a_hider_class -> The class of which to remove that hides the element. For some elements, this is inner_hide, but there
                could be others as well. String.
            

DESCRIPTION
        This function in essence based on a drop down option displays an option and its corresponding inputs based on the value of a dropdown menu. 
        While it has a lot of arguments, 2/5 are default. Only thing of note is the inverted makes some of the code seem rather
        redundant, though I don't have much of another solution, unfortunately, as it seemes to be the only way. 
RETURNS
        None
*/
/**/
function show_or_hide_based_on_option(a_selection_element, a_show_or_hide_element, a_string_val, a_inverted = false, a_hider_class = "hide") {
    hide_elements = a_show_or_hide_element.querySelectorAll(".required_hidable")
        
    if (!a_inverted) {
        if (a_selection_element.value == a_string_val) {
            a_show_or_hide_element.classList.remove(a_hider_class);
            for (hide_itr = 0; hide_itr < hide_elements.length; hide_itr++ ) {
                hide_elements[hide_itr].required = true                    
            }
        } 
        else {
            a_show_or_hide_element.classList.add(a_hider_class);
            for (hide_itr = 0; hide_itr < hide_elements.length; hide_itr++ ) {
                hide_elements[hide_itr].required = false                    
            }           
            
        }
    }
    
    else {
        if (a_selection_element.value != a_string_val) {
            a_show_or_hide_element.classList.remove(a_hider_class);
            for (hide_itr = 0; hide_itr < hide_elements.length; hide_itr++ ) {
                hide_elements[hide_itr].required = true                    
            }
        } 
        else {
            a_show_or_hide_element.classList.add(a_hider_class);
            for (hide_itr = 0; hide_itr <hide_elements.length; hide_itr++ ) {
                hide_elements[hide_itr].required = false                    
            }

        }                
    }
    
    
}





    