/**/
/*
NAME
        load_settings_from_file() - Fills in the HTML form from a JSON file. 

SYNOPSIS
        load_settings_from_file()

DESCRIPTION
        This fills the entire HTML form utilizing the settings from a given JSON file. The only thing of note is 
        for some reason, in the past, if I didn't clear the input local variable's name, or otherwise the file element's value 
        after first loading, the program would never load files again until the page refreshed.
RETURNS
        None
        
ACKNOWLEDGEMENTS
        Parts of the function come from the following: 
        https://stackoverflow.com/questions/42099368/file-reader-telling-me-that-parameter-1-is-not-a-blob
*/
/**/

function load_settings_from_file() {
    
    let input = document.getElementById('file');
    let file = input.files[0];
    let reader = new FileReader();
    
    
    reader.readAsText(file);

    
    reader.onload = function(evt) {
        let settings_json = JSON.parse(evt.target.result)
        fill_backend_settings(settings_json['backend_settings'])
        fill_netherworld_settings(settings_json['netherworld_settings'])
        fill_provider_settings(settings_json['provider_settings'])
        fill_model_settings(settings_json['model_settings'])
        fill_tokenizer_settings(settings_json['tokenizer_settings'])
        fill_generation_settings(settings_json['generation_settings'])
        fill_input_settings(settings_json['input_settings'])
        fill_experimental_settings(settings_json['experimental_settings'])
    }
    
    // This is unholy, but again, for some reason, if I do not do this, I cannot load again.
    input.value = ""
    
}

/**/
/*
NAME
        fill_backend_settings(a_backend_settings) - Fills in the HTML form from a JSON file for Backend related settings specifically.  

SYNOPSIS
        fill_backend_settings(a_backend_settings)
            a_backend_settings -> the settings relating to the backend which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned backend settings.
RETURNS
        None
*/
/**/
function fill_backend_settings(a_backend_settings) {
    let backend_url = document.getElementById("backend_url")
    backend_url.value = a_backend_settings['url']
}

/**/
/*
NAME
        fill_netherworld_settings(netherworld_settings) - Fills in the HTML form from a JSON file for Netherworld related settings specifically. 

SYNOPSIS
        fill_netherworld_settings(a_netherworld_settings)
            a_netherworld_settings -> the settings relating to the Netherworld which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Netherworld settings.
RETURNS
        None
        
*/
/**/
function fill_netherworld_settings(netherworld_settings) {
    let keys = Object.keys(netherworld_settings)
    
    let memory_cycler_select = document.getElementById("memory_cycler_select")
    let pipeline = document.getElementById("pipeline")
    let device = document.getElementById("device_select")
    
    
    let gpu_number_input = document.getElementById("gpu_number_input")
    let extra_budget = document.getElementById("extra_budget_input")
    
    memory_cycler_select.value = netherworld_settings['memory_cycler']
    pipeline.value = netherworld_settings['pipeline']
    device_split = netherworld_settings['device'].split(":")
    
    device.value = device_split[0] == "cuda" ? "cuda:" : "cpu"
    gpu_number_input.value = device_split.length == 2 ? device_split[1] : null
    extra_budget.value = memory_cycler_select.value!= "none" ? netherworld_settings['extra_budget'] : null
}

/**/
/*
NAME
        fill_provider_settings(a_provider_settings) - Fills in the HTML form from a JSON file for Provider related settings specifically. 

SYNOPSIS
        fill_provider_settings(a_provider_settings)
            a_netherworld_settings -> the settings relating to the Provider which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Provider settings.
RETURNS
        None
        
*/
/**/
function fill_provider_settings(a_provider_settings) {
    let keys = Object.keys(a_provider_settings)
    
        
    let provider_type = document.getElementById("provider_type")
    provider_type.value = a_provider_settings['provider_type']
    let user_name = document.getElementById("user_name")
    user_name.value = a_provider_settings['user_name']
    let bot_name = document.getElementById("bot_name")
    bot_name.value = a_provider_settings['bot_name']
    
    
    
    //Needed because change doesn't work with programatic changes for some reason.
    discord_elements = document.getElementsByClassName("discord_exclusive")
    show_hide_multiple(provider_type, discord_elements, "discord")
    
    
    if (provider_type.value == "discord") {
        let status_type = document.getElementById("status_type")
        status_type.value = a_provider_settings['status_type']
        
        let conditional_response = document.getElementById("conditional_response")
        let bot_nicknames_input = document.getElementById("bot_nicknames_input")
        if (a_provider_settings['conditional_response']) {
            if (conditional_response.checked==false){
                conditional_response.click()
            }
            bot_nicknames_input.value = a_provider_settings['bot_nicknames'].join(",")
        }
        else {
            bot_nicknames_input.value = null
        }		
        let bot_token_input = document.getElementById("bot_token_input")
        bot_token_input.value = a_provider_settings['token']
        
        let status_body = document.getElementById("status_body")
        let status_body_input = document.getElementById("status_body_input")
        status_type.value = a_provider_settings['status_type']
        status_body_input.value = status_type.value != "none" ? a_provider_settings['status_body'] : null
        
        show_or_hide_based_on_option(status_type, status_body, "none", true, "inner_hide")
        let main_guild_id = document.getElementById("main_guild_id")
        main_guild_id.value = a_provider_settings['main_guild_id']
    }
    

}

/**/
/*
NAME
        fill_model_settings(a_model_settings) - Fills in the HTML form from a JSON file for Model related settings specifically. 

SYNOPSIS
        fill_model_settings(a_model_settings)
            a_model_settings -> the settings relating to the Model which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Model settings.
RETURNS
        None
        
*/
/**/
function fill_model_settings(a_model_settings) {
    let model_path = document.getElementById("model_path")
    let data_select = document.getElementById("data_select")
    let local_files_only_model = document.getElementById("local_files_only_model")
    
    model_path.value = a_model_settings['model']
    data_select.value = a_model_settings['model_data_type']
    local_files_only_model.checked = a_model_settings['local_files_only']
}


/**/
/*
NAME
        fill_tokenizer_settings(a_tokenizer_settings) - Fills in the HTML form from a JSON file for Tokenizer related settings specifically. 

SYNOPSIS
        fill_tokenizer_settings(a_tokenizer_settings)
            a_tokenizer_settings -> the settings relating to the Tokenizer which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Tokenizer settings.
RETURNS
        None
        
*/
/**/
function fill_tokenizer_settings(a_tokenizer_settings) {
    let tokenizer_path = document.getElementById("tokenizer_path")
    let add_prefix_space = document.getElementById("add_prefix_space")
    let local_files_only_tokenizer = document.getElementById("local_files_only_tokenizer")
    
    tokenizer_path.value = a_tokenizer_settings['tokenizer']
    add_prefix_space.checked = a_tokenizer_settings['add_prefix_space']
    local_files_only_tokenizer.checked = a_tokenizer_settings['local_files_only']
}


/**/
/*
NAME
        fill_generation_settings(a_generation_settings) - Fills in the HTML form from a JSON file for Generation related settings specifically. 

SYNOPSIS
        fill_generation_settings(a_generation_settings)
            a_generation_settings -> the settings relating to the Generation which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Generation settings. Calls 
        fill_sampler_settings and fill_syntax_settings as this setting group is nested with two seperate
        settings groups, syntax_settings and sampler_settings.
RETURNS
        None
        
*/
/**/
function fill_generation_settings(a_generation_settings) {
    fill_sampler_settings(a_generation_settings['sampler_settings'])
    fill_syntax_settings(a_generation_settings['syntax_settings'])
}


/**/
/*
NAME
        fill_sampler_settings(a_sampler_settings) - Fills in the HTML form from a JSON file for Sampling related settings specifically. 

SYNOPSIS
        fill_sampler_settings(a_sampler_settings)
            a_sampler_settings -> the settings relating to the Sampling which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Sampling settings. If the user
        has only the recommended settings, click the appropriate checkbox in regards to if this is true or false.
RETURNS
        None
        
*/
/**/
function fill_sampler_settings(a_sampler_settings) {
    default_settings = {
        "penalty_alpha" : 0.6,
        "top_k" : 4
    }
    
    if (JSON.stringify(a_sampler_settings) != JSON.stringify(default_settings)) {
        if (document.getElementById("sampler_recommend").checked == true) {
            document.getElementById("sampler_recommend").click();
        }
        document.getElementById("do_sample").checked = "do_sample" in Object(a_sampler_settings) ? a_sampler_settings['do_sample'] : null
        fill_if_used("top_p_check", "top_p", "top_p", a_sampler_settings )
        fill_if_used("top_k_check", "top_k", "top_k", a_sampler_settings )
        fill_if_used("temperature_check", "temperature", "temperature", a_sampler_settings )
        fill_if_used("repetition_penalty_check", "repetition_penalty", "repetition_penalty", a_sampler_settings )
        fill_if_used("typical_p_check", "typical_p", "typical_p", a_sampler_settings )
        fill_if_used("penalty_alpha_check", "penalty_alpha", "penalty_alpha", a_sampler_settings )
    }
    
    else {
        if (document.getElementById("sampler_recommend").checked == false) {
            document.getElementById("sampler_recommend").click();
        }
    }



}

/**/
/*
NAME
        fill_syntax_settings(a_syntax_settings) - Fills in the HTML form from a JSON file for Syntax related settings specifically. 

SYNOPSIS
        fill_syntax_settings(a_syntax_settings)
            a_syntax_settings -> the settings relating to the Syntax which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Syntax settings. If the user
        has only the recommended settings, click the appropriate checkbox in regards to if this is true or false.
RETURNS
        None
        
*/
function fill_syntax_settings (a_syntax_settings) {
    default_settings = {
        "eos_token_id" : 198,
        "pad_token_id" : 50256, 
        "max_length": 1000
    }
    
    if (JSON.stringify(a_syntax_settings) != JSON.stringify(default_settings)) {
        if (document.getElementById("syntax_recommend").checked == true) {
            document.getElementById("syntax_recommend").click();
        }
        document.getElementById("max_length").value = a_syntax_settings["max_length"]
        fill_if_used("eos_token_id_check", "eos_token_id", "eos_token_id", a_syntax_settings)
        fill_if_used("pad_token_id_check", "pad_token_id", "pad_token_id", a_syntax_settings)
        fill_if_used("min_length_check", "min_length", "min_length", a_syntax_settings)
        fill_if_used("max_time_check", "max_time", "max_time", a_syntax_settings)
        fill_if_used("bad_word_check", "bad_words_area", "bad_words_area", a_syntax_settings)
    }
    
    else {
        if (document.getElementById("syntax_recommend").checked == false) {
            document.getElementById("syntax_recommend").click();
        }
    }

}

/**/
/*
NAME
        fill_input_settings(a_input_settings)  - Fills in the HTML form from a JSON file for Input related settings specifically. 

SYNOPSIS
        fill_input_settings(a_input_settings) 
            fill_input_settings -> the settings relating to the Input settings which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Input settings. If the prompt type is basic,
        simply copy the value. Otherwise, utilize the saved json version of the prompt to load the file. Both types will
        click on or off depending if the current view is not equivalent to the value of the prompt type. 
        The example conversation also uses a regex to get rid of extra spaces next to new lines.
        This is was mostly needed, as there was an issue with the example conversation gradually getting new lines 
        every time the file was loaded due to the way that it's saved. 
RETURNS
        None
ACKNOWLEDGEMENTS
        Anthony Mercurio, who helped design the regex to deal with the filling in the example conversation.
        
*/
function fill_input_settings(a_input_settings) {
    let advanced_checked = document.getElementById("advanced_checked")
    let basic_prompt = document.getElementById("basic_prompt_output")
    let example_conversation  = document.getElementById("example_conversation")
    let json_output = document.getElementById("textareaJSONOutput")
    let selectFormat = document.getElementById("selectFormat")
    let loadFromJson = document.getElementById("loadFromJson")
    
    if (a_input_settings["prompt_type"] =="basic") {
        if (advanced_checked.checked == true) {
            advanced_checked.click()
        }
        basic_prompt.value = a_input_settings['prompt']
    }
    
    else {
        if (advanced_checked.checked != true) {
            advanced_checked.click()
        }
        
        selectFormat.value = a_input_settings["prompt_type"]                   
        json_output.value = JSON.stringify(a_input_settings["json_prompt"], null, 4)
        loadFromJson.click();
    }
    
    // Needed so no new spaces are added when the settings are saved again. 
    example_conversation.value = a_input_settings['example_conversation'].replace(/^[ \t]+/gm, '').replace(/ {2,}/g, ' ')
}

/**/
/*
NAME
       fill_experimental_settings(a_experimental_settings - Fills in the HTML form from a JSON file for Experimental settings specifically. 

SYNOPSIS
        fill_experimental_settings(a_experimental_settings
            a_experimental_settings -> Experimental settings which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned experimental settings. Calls 
        fill_experimental_processors and fill_experimental_warpers as this setting group is nested with two seperate
        settings groups, experimental_processors and experimental_warpers. However, this is only done if these keys\
        exist in the settings JSON, and otherwise, nothing is done. In addition, if the settings do exist, the HTML will 
        show the settings accordingly, hence the clicks.
RETURNS
        None
        
*/
/**/
function fill_experimental_settings(a_experimental_settings) {
    let experimental_processors = a_experimental_settings['experimental_processors']
    let experimental_warpers = a_experimental_settings['experimental_warpers']
    
    if (experimental_processors) {
        fill_experimental_processors(experimental_processors)
    }
    else {
        if (document.getElementById("processor_recommend").checked == false) {
            document.getElementById("processor_recommend").click();
        }
    }
    
    
    if (experimental_warpers) {
        fill_experimental_warpers(experimental_warpers)
    }
    else {
        if (document.getElementById("warper_recommend").checked == false) {
            document.getElementById("warper_recommend").click();
        }
    }
    
    
    
}

/**/
/*
NAME
        fill_experimental_processors(a_experimental_processors) - Fills in the HTML form from a JSON file for Experimental Processor related settings specifically. 

SYNOPSIS
        fill_experimental_processors(a_experimental_processors)
            a_experimental_processors -> the settings relating to the Experimental Processors which will fill the HTML form. 

DESCRIPTION
        This function fills the logit bias table accordingly, as its the only experimental processor. It does this by iterating 
        through the HTML tables rows. 
RETURNS
        None
        
*/
function fill_experimental_processors(a_experimental_processors) {
    let logit_table = document.getElementById("logit-table")
    let processor_check = document.getElementById("processor_recommend")
    let logit_processors = a_experimental_processors['logit_bias']
    let add_attribute = document.getElementById("add_attribute")
    
    if (processor_check.checked == true ) {
        processor_check.click()
    }
    
    for (row_itr = 0; row_itr < logit_processors.length; row_itr++) {
        if (typeof logit_table.rows[row_itr+1] === "undefined") {
            add_attribute.click();
        }
        // Why rows + 1? Because the legend table is at the 0th index. 
        logit_table.rows[row_itr+1].cells[0].children[0].value = logit_processors[row_itr][0]
        logit_table.rows[row_itr+1].cells[1].children[0].value = logit_processors[row_itr][1]
    }
            
}

/**/
/*
NAME
        fill_experimental_warpers(a_experimental_warpers) - Fills in the HTML form from a JSON file for Experimental Warper related settings specifically. 

SYNOPSIS
         fill_experimental_warpers(a_experimental_warpers)
            a_experimental_warpers -> the settings relating to the Experimental Warpers which will fill the HTML form. 

DESCRIPTION
        This function fills the HTML elements related to the aforementioned Experimental Warper settings. If this is the case,
        display the settings. 
RETURNS
        None
        
*/
function fill_experimental_warpers(a_experimental_warpers) {
    if (document.getElementById("warper_recommend").checked = true) {
        document.getElementById("warper_recommend").click();
    }
    fill_if_used("tfs_check", "tfs", "tfs", a_experimental_warpers )
    fill_if_used("top_a_check", "top_a", "top_a", a_experimental_warpers )
}

/**/
/*
NAME
        fill_if_used(a_argument_button, a_argument_to_fill, a_element_to_fill_with, a_settings_list, a_uses_list=false) - 
        Fills the arguments if they are used, based on the checkbox next to the argument's name. 

SYNOPSIS
        fill_if_used(argument_button, argument_to_fill, element_to_fill_with, settings_list, uses_list=false)
            a_argument_button -> The checkbox that checks off whether to use the argument or not. 
            a_argument_to_fill -> The numeric value to fill with. For example, if I saved my settings with top_p = 0.9, 0.9.
            a_element_to_fill_with -> The specific numeric input to fill with argument_to_fill. 
            a_settings_list -> The list of settings that are related to the option if applicable. List.
            a_uses_list -> Whether or not the element to fill uses a list or not. 
       
DESCRIPTION
        This function is mostly the bulk of generation related settings, i.e. syntax, sampler, experimental warpers, etc.. anything that has 
        a value and range input, though the parameter uses_list shows an exception to this: the bad words list. 
RETURNS
        None
        
*/
function fill_if_used(a_argument_button, a_argument_to_fill, a_element_to_fill_with, a_settings_list, a_uses_list=false) {
    settings_list_keys = Object.keys(a_settings_list)
    element_argument_to_fill = document.getElementById(a_argument_to_fill)
    element_argument_button = document.getElementById(a_argument_button)
    a_element_to_fill_with =  settings_list_keys.includes(a_argument_to_fill) ? a_settings_list[a_argument_to_fill] : null
   
    if (element_argument_button.checked == false) {
        element_argument_button.click(); 
    }
   
    
    if (a_element_to_fill_with != null && a_uses_list === false ) {
        a_element_to_fill_with.value = a_settings_list[a_argument_to_fill]
    
    } 
    
    else if (a_element_to_fill_with != null && a_uses_list === true) {
        a_element_to_fill_with.value = Array.from(a_settings_list[a_argument_to_fill]).join(",")
    }
}



