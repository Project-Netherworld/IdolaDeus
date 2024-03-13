# IdolaDeus
The settings builder for Project Netherworld. For more information about the Project, see [this homepage](https://github.com/Project-Netherworld).

## Features 
- Serialization(Saving/Loading) of various settings utilized in Project Netherworld via a JSON file
- Integrated [W++ editor](https://github.com/nolialsea/Wpp) from [nolialsea](https://github.com/nolialsea) for advanced prompting for GPT-J/NEO/NEOX based models
- Efficient Interface for prompt editing, setting various logit biases, etc..

## Installation 
1. Either visit the [Github Pages Site](https://project-netherworld.github.io/IdolaDeus/) or download the ZIP from the latest release and extract it.
2. If using the ZIP download, click on `index.html` to visit the website. The settings builder can be run completely offline. 

## Usage 
There are quite a lot of settings, so for a detailed description, please visit the [List of Setting Descriptions](https://github.com/Project-Netherworld/IdolaDeus/wiki/List-of-Setting-Descriptions).
Should you wish instead to watch a video explaining the settings, there are two videos, one for [Basic Settings](https://www.youtube.com/watch?v=1DaV5suk7RU) and [Advanced Settings](https://www.youtube.com/watch?v=HOCsJhbmsZA).

(Note that in regards to the advanced video, the following corrections need to be made:)
- `top_p` is the inverse of its description. It randomly picks a token from all tokens that add up to less than the threshold. For example, if `top_p` is 0.9, it will take all tokens whose probability adds up to less than 0.9.
- `top_k` randomly picks a token from the k best tokens. In practice, a commonly used k is 40.


However, certain settings in particular require some further explanation. 
In particular, please visit the pages to create a [Discord bot and retrieve Discord-related settings](https://github.com/Project-Netherworld/IdolaDeus/wiki/Creating-a-Discord-Bot) (guild ID, token, etc..) 
and [how to choose a Model and retrieve its related settings](https://github.com/Project-Netherworld/IdolaDeus/wiki/Model-Acquisition-and-Hardware-Requirements) (Model-URL, Tokenizer URL, etc..).

Once you are done creating your settings, be sure to **save the settings in the [Phantasmagoria Front End](https://github.com/Project-Netherworld/Phantasmagoria)'s config folder. If there is no such folder, make a folder in the Front End's directory called `config` and paste the settings in there.**

The Settings Builder also supports loading settings, so previously saved settings can be reloaded to be edited. 




