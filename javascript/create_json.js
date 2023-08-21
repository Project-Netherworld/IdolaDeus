const form= document.getElementById("form");
form.addEventListener("submit", function(){ create_json() });


/**/
/*
NAME
        create_json() - Creates a JSON object and then downloads it as a JSON file based on the filled out form.

SYNOPSIS
        create_json()

DESCRIPTION
        Based on all the values the user input, create a JSON object and serializes it. To note here is the Blob, 
        which in essence is a file object that we can arbitrary create. Also, this requires creating a temporary element,
        and assigning an event to download this arbitrary object when we click it. Of course, the element is removed at the end of this
        function. 
RETURNS
        None
*/
/**/

function create_json() {
    let json_dictionary = {
        "backend_settings": {
            "url" : document.getElementById("backend_url").value
        }
    }
    create_netherworld_settings(json_dictionary)
    create_provider_settings(json_dictionary)
    create_tokenizer_settings(json_dictionary)
    create_model_settings(json_dictionary)
    create_generation_settings(json_dictionary)
    create_input_settings(json_dictionary)
    create_experimental_settings(json_dictionary)
    
    // Stringify the JSON object such that there's no one line format, and that the indentation level is 4. 
    let settings = JSON.stringify(json_dictionary, null, 4);
    let blob = new Blob([settings], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    
    const temp_element = document.createElement('a');
    temp_element.setAttribute('id', 'temporary_element')
    temp_element.setAttribute('download', 'netherworld_settings.json');
    temp_element.setAttribute('href', url);

    // Unfortunately, like a lot of things in client side javascript, only way
    // to download is via a click, even if artificially made. 
    temp_element.dispatchEvent(new MouseEvent('click'));
    temp_element.remove();
    
    

}

/**/
/*
NAME
        create_netherworld_settings() - Creates the Netherworld Portion of the settings within the JSON object. 

SYNOPSIS
        create_netherworld_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Netherworld Settings and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. 
RETURNS
        None
*/
/**/
function create_netherworld_settings(a_json_dictionary) {
    a_json_dictionary['netherworld_settings'] = {
        "memory_cycler" : document.getElementById("memory_cycler_select").value,
        "pipeline": document.getElementById("pipeline").value,
        "device": (document.getElementById("device_select").value == "cpu"  
                  ? document.getElementById("device_select").value
                  :
                  document.getElementById("device_select").value + document.getElementById("gpu_number_input").value),
        "extra_budget": parseInt(use_value_if_not_equals_value("memory_cycler_select", "extra_budget_input", "none", 0))
    }
}

/**/
/*
NAME
        create_provider_settings() - Creates the Netherworld Portion of the settings within the JSON object. 

SYNOPSIS
        create_provider_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Provider Settings and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. 
RETURNS
        None
*/
/**/
function create_provider_settings(a_json_dictionary) {
    provider_type = document.getElementById("provider_type").value
    bot_nicknames_input = use_value_if_checked("conditional_response", "bot_nicknames_input")
    
    if (provider_type ==="discord") {
        a_json_dictionary['provider_settings'] = {
            "provider_type" : provider_type,
            "user_name" : document.getElementById("user_name").value,
            "bot_name" : document.getElementById("bot_name").value,
            "conditional_response" : document.getElementById("conditional_response").checked,
            "bot_nicknames" : bot_nicknames_input == null ? null : bot_nicknames_input.split(","),
            "status_type": document.getElementById("status_type").value,
            "status_body": use_value_if_not_equals_value("status_type", "status_body_input", "none"),
            "token" : document.getElementById("bot_token_input").value,
            "main_guild_id" : document.getElementById("main_guild_id").value
        }
    }
    else {
        a_json_dictionary['provider_settings'] = {
            "provider_type" : provider_type,
            "user_name" : document.getElementById("user_name").value,
            "bot_name" : document.getElementById("bot_name").value
        }
    }
}


/**/
/*
NAME
        create_tokenizer_settings() - Creates the Tokenizer Portion of the settings within the JSON object. 

SYNOPSIS
        create_tokenizer_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Tokenizer Settings and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. 
RETURNS
        None
*/
/**/
function create_tokenizer_settings (a_json_dictionary) {
    a_json_dictionary['tokenizer_settings'] = {
        "tokenizer": document.getElementById("tokenizer_path").value,
        "add_prefix_space" : document.getElementById("add_prefix_space").checked,
        "local_files_only" : document.getElementById("local_files_only_tokenizer").checked
    }
}

/**/
/*
NAME
        create_model_settings() - Creates the Tokenizer Portion of the settings within the JSON object. 

SYNOPSIS
        create_model_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Model Settings and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. 
RETURNS
        None
*/
function create_model_settings (json_dictionary) {
    json_dictionary['model_settings'] = {
        "model": document.getElementById("model_path").value,
        "local_files_only" : document.getElementById("local_files_only_model").checked,
        "model_data_type" : document.getElementById("data_select").value,
        "device_map": "auto"
    }
}

/**/
/*
NAME
        create_generation_settings() - Creates the Generation Portion of the settings within the JSON object. 

SYNOPSIS
        create_generation_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Calls create_sampler_recommend and create_syntax_settings, as this setting group has 
        two nested settings groups. 
RETURNS
        None
*/
function create_generation_settings(a_json_dictionary) {
    
    a_json_dictionary['generation_settings'] = {}
    create_sampler_recommend(a_json_dictionary)
    create_syntax_settings(a_json_dictionary)


}

/**/
/*
NAME
        create_sampler_recommend() - Creates the Sampler Portion of the settings within the JSON object. 

SYNOPSIS
        create_sampler_recommend(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Sampler Settings if the user is not using the recommend settings,
        and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. Otherwise, go with a predefined dictionary. 
RETURNS
        None
*/
function create_sampler_recommend(a_json_dictionary) {
    recommend_settings_sampler = document.getElementById("sampler_recommend").checked
    
    if (recommend_settings_sampler) {
        a_json_dictionary['generation_settings']['sampler_settings'] = {
            "penalty_alpha" : 0.6,
            "top_k" : 4
        }
    }
    else {
        a_json_dictionary['generation_settings']['sampler_settings'] = {
            "do_sample" : document.getElementById("do_sample").checked,
            "top_p" : parseFloat(use_value_if_checked("top_p_check", "top_p")),
            "penalty_alpha" : parseFloat(use_value_if_checked("penalty_alpha_check", "penalty_alpha")),
            "top_k" : parseInt(use_value_if_checked("top_k_check", "top_k")),
            "typical_p" : parseFloat(use_value_if_checked("typical_p_check", "typical_p")),
            "temperature" : parseFloat(use_value_if_checked("temperature_check", "temperature")),
            "typical_p" : parseFloat(use_value_if_checked("typical_p_check", "typical_p")),
            "repetition_penalty" : parseFloat(use_value_if_checked("repetition_penalty_check", "repetition_penalty"))
        }            
    }

}

/**/
/*
NAME
        create_syntax_settings() - Creates the Syntax Portion of the settings within the JSON object. 

SYNOPSIS
        create_syntax_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Syntax Settings if the user is not using the recommend settings,
        and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. Otherwise, go with a predefined dictionary. 
RETURNS
        None
*/
function create_syntax_settings(a_json_dictionary) {
    recommend_settings_syntax = document.getElementById("syntax_recommend").checked
    
    if (recommend_settings_syntax) {
        a_json_dictionary['generation_settings']['syntax_settings'] = {
            "eos_token_id" : 198,
            "pad_token_id" : 50256, 
            "max_length": 1000
        }
    }
    else {
        a_json_dictionary['generation_settings']['syntax_settings'] = {
            "eos_token_id" : parseInt(use_value_if_checked("eos_token_id_check", "eos_token_id")),
            "pad_token_id" : parseInt(use_value_if_checked("pad_token_id_check", "pad_token_id")),
            "max_length": parseInt(document.getElementById("max_length").value),
            "min_length" : parseInt(use_value_if_checked("min_length_check", "min_length")),
            "max_time" : parseFloat(use_value_if_checked("max_time_check", "max_time")),
            "bad_word_ids" : use_value_if_checked("bad_word_check", "bad_words_area").split(", ")
        }    
    
    
    }
}


/**/
/*
NAME
        create_input_settings() - Creates the Input Portion of the settings within the JSON object. 

SYNOPSIS
        create_input_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Calls create_description_settings and create_example_conversation_settings, as this setting group has 
        two nested settings groups. 
RETURNS
        None
*/
function create_input_settings(json_dictionary) {
    
    json_dictionary['input_settings'] = {}
    
    create_description_settings(json_dictionary)
    create_example_conversation_settings(json_dictionary)

}

/**/
/*
NAME
        create_description_settings() - Creates the Description Portion of the settings within the JSON object. 

SYNOPSIS
        create_description_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        This function either takes the value of the basic prompt and ensures there are no newlines, or if the user is 
        using advanced settings, ensure that if the user is using W++, that the output is in a one line format so as to
        be able to use it by the main program. Also, save a json version of the prompt for easy editing.
        Both versions save a prompt type for this same reason. 
RETURNS
        None
*/
function create_description_settings(a_json_dictionary) {
    let is_advanced_prompt = document.getElementById("advanced_checked") 
    if (is_advanced_prompt.checked) {
        let advanced_prompt_type =  document.getElementById("selectFormat").value
        let one_line_format_button = document.getElementById("oneLineFormat")
        
        
        if (advanced_prompt_type == "wpp" && !one_line_format_button.checked) {
            one_line_format_button.click()
            parseResult(true)
            let advanced_prompt_value = document.getElementById("textareaOutput").value
            a_json_dictionary['input_settings']['prompt'] = advanced_prompt_value
            a_json_dictionary['input_settings']['json_prompt'] = JSON.parse(document.getElementById("textareaJSONOutput").value)
            a_json_dictionary['input_settings']['prompt_type'] = advanced_prompt_type
            one_line_format_button.click()
        }
        else {
            let advanced_prompt_value = document.getElementById("textareaOutput").value
            a_json_dictionary['input_settings']['prompt'] = advanced_prompt_value
            a_json_dictionary['input_settings']['prompt_type'] = advanced_prompt_type
        
        }
        
    
    }
    else {
        basic_prompt_output = document.getElementById("basic_prompt_output").value
        basic_prompt_output.replace("\n", " ")
        a_json_dictionary['input_settings']['prompt'] = basic_prompt_output
        a_json_dictionary['input_settings']['prompt_type'] = 'basic'
    }

}

/**/
/*
NAME
        create_example_conversation_settings() - Creates the Example Conversation portion of the settings within the JSON object. 

SYNOPSIS
        create_example_conversation_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        This function saves the example conversation to the JSON object. This is tricky however as the example conversation 
        has a lack of spaces and newlines,
        which we cannot have in our prompt as it will mess it up drastically otherwise, 
        combined with the frustration of HTML not supplying new lines with spaces.  
        So, utilizing a regex expression my friend gave me, I fixed this problem. The regex expression does the following: 
        1. The first part of the string makes it such that there is a space added to all occurences of colons. 
        2. The second part makes it such that all new lines have added spaces on both sides. 
RETURNS
        None
        
ACKNOWLEDGEMENTS:
        Anthony Mercurio for giving me this regex code/being a regex wizard. 
*/
function create_example_conversation_settings(a_json_dictionary) {
    example_conversation = document.getElementById("example_conversation").value
    example_conversation = example_conversation.replace(/([\w ]+):([\w]+)/g, '$1: $2.').replace(/\n/g, ' \n ')
    a_json_dictionary['input_settings']['example_conversation'] = example_conversation
}

/**/
/*
NAME
        create_experimental_settings() - Creates the Experimental Portion of the settings within the JSON object. 

SYNOPSIS
        create_experimental_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Calls create_experimental_processors and create_experimental_warpers, as this setting group has 
        two nested settings groups. 
RETURNS
        None
*/
function create_experimental_settings(a_json_dictionary) {
    
    a_json_dictionary["experimental_settings"] ={}
    create_experimental_processors(a_json_dictionary)
    create_experimental_warpers(a_json_dictionary)
}

/**/
/*
NAME
        create_experimental_processors() - Creates the Experimental Processors Portion of the settings within the JSON object. 

SYNOPSIS
        create_experimental_settings(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Based on the Logit Bias Table list, gather the logit (word) column (0) and the threshold column (1) from the table. 
        Starts at 1, as the 0th row is our legend. Fills the experimental processor key of experimental_settings in the JSON object,
        with a 2d list, each containing a logit and a bias. 
RETURNS
        None
*/
function create_experimental_processors(a_json_dictionary) {

    let processor_recommend = document.getElementById("processor_recommend").checked
    
    if (!processor_recommend) {     
        logit_bias_list = []
        logit_table = document.getElementById("logit-table")
        
        //https://stackoverflow.com/questions/24307292/how-can-i-get-the-value-of-an-input-in-a-specific-table-cell-using-javascript
        for (let row_itr = 1; row_itr < logit_table.rows.length; row_itr++) {
            if (logit_table.rows[row_itr].cells[0].children.value!="" && logit_table.rows[row_itr].cells[1].children[0].value!="0") {
                converted_second_element = parseFloat(logit_table.rows[row_itr].cells[1].children[0].value)
                logit_bias_list.push([logit_table.rows[row_itr].cells[0].children[0].value,converted_second_element])
            }
        }
    
    
        a_json_dictionary["experimental_settings"]["experimental_processors"] = {
            "logit_bias" : logit_bias_list
        }
    }

}

/**/
/*
NAME
        create_experimental_warpers() - Creates the Experimental Warpers of the settings within the JSON object. 

SYNOPSIS
        create_experimental_warpers(a_json_dictionary) ->
            a_json_dictionary-> the JSON object that will be filled with the appropriate settings and then downloaded.

DESCRIPTION
        Gathers all the values of the elements regarding Syntax Settings if the user is using experimental settings,
        and then makes a JSON dictionary key with the values as their
        own keys, with the values being the inputs. Otherwise, do nothing. 
RETURNS
        None
*/
function create_experimental_warpers(a_json_dictionary) {
    let processor_recommend = document.getElementById("warper_recommend").checked
    if (!processor_recommend) {
        a_json_dictionary["experimental_settings"]["experimental_warpers"] = {  
            "top_a" : parseFloat(use_value_if_checked("top_a_check", "top_a")),
            "tfs" : parseFloat(use_value_if_checked("tfs_check", "tfs")),
        }
    }
}

/**/
/*
NAME
        use_value_if_not_equals_value(a_value_of_interest, a_value_to_use, - Use return the value if its not equal to a value
        to compare to. If is, return an alternate variable. 
        a_value_to_compare, a_alt_value = null)

SYNOPSIS
        use_value_if_not_equals_value(a_value_of_interest, a_value_to_use, a_value_to_compare, a_alt_value = null) 
            a_value_of_interest-> The value of interest that is to be compared against.
            a_value_to_use-> The value that has the potential to be returned based on the comparison. 
            a_value_to_compare-> The value to compare against. 
            a_alt_value -> The alternate variable to use if the comparison fails. null by default. 
            

DESCRIPTION
        This function in essence is typically used with dropdown menus and checks if their input is not "none". 
        If that is the case, then the value is used in the JSON file. Otherwise, it is null, meaning it is ignored 
        by the main program. 
RETURNS
        element_value_to_use.value(aka the value of the value of the element argument passed) or null.
*/
function use_value_if_not_equals_value(a_value_of_interest, a_value_to_use, a_value_to_compare, a_alt_value = null) {
    let element_value_of_interest = document.getElementById(a_value_of_interest)
    let element_value_to_use = document.getElementById(a_value_to_use)
    if(element_value_of_interest.value != a_value_to_compare) {
        return element_value_to_use.value
    }
    else {
        return a_alt_value
    }
} 

/**/
/*
NAME
        use_value_if_checked(checked_value, value_to_use)- Use the value if the checkbox element is checked.

SYNOPSIS
        use_value_if_checked(a_checked_value, a_value_to_use) 
            a_checked_value -> The element to check the value of. 
            a_value_to_use -> The value to use if the checkbox is checked.
            

DESCRIPTION
        This function in essence is typically used with checkboxes and sees if they are input checked. 
        If that is the case, then the value is used in the JSON file. Otherwise, it is null, meaning it is ignored 
        by the main program. 
RETURNS
        element_value_to_use.value, or null.
*/
function use_value_if_checked(a_checked_value, a_value_to_use) {
    element_checked_value = document.getElementById(a_checked_value)
    element_value_to_use = document.getElementById(a_value_to_use)
    
    if(element_checked_value.checked == true) {
        return element_value_to_use.value
    }
    else {
        return null
    }   
}



