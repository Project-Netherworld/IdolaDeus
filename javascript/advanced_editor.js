// As I'm not exactly well versed in this past the basics, I will be leaving this code alone as its taken from 
// https://github.com/nolialsea/Wpp. So, please look towards there for documentation purposes. The main use of this code
// is the advanced W++ and SBF editor, which both are useful tools for making prompts. The HTML also documents this fact for  
// the elements added from there. Also, some JSON saving and downloading functions are also used. 



const selectFormat = document.getElementById("selectFormat")
const spanFormatName = document.getElementById("spanFormatName")
const checkboxQuotes = document.getElementById("checkboxQuotes")
const oneLineFormat = document.getElementById("oneLineFormat")
const squareBracketsEncasing = document.getElementById("squareBracketsEncasing")
const textareaOutput = document.getElementById("textareaOutput")
const objectName = document.getElementById("objectName")
const objectType = document.getElementById("objectType")

const table = document.getElementById("table")

function getStartTimerFunction() {
    let timer

    return (e) => {
        if (e.key === "Tab") {
            updateTable()
            parseResult()
        } else {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                updateTable()
                parseResult()
            }, 0.0001)
        }
    }
}

const formats = {
    wpp: {
        name: `W++`,
        options: ['optionQuotes', 'optionOneLine', `optionSquareBracketsEncasing`],
        getPrefix: (objectType, parsedObjectName, spaceOrNewLine) => `${objectType}(${parsedObjectName})${spaceOrNewLine}{${spaceOrNewLine}`,
        getValuesSeparator: () => ` + `,
        getAttributeSeparator: (isOneLineFormat) => isOneLineFormat ? ', ' : '\n',
        addAttribute: (propertyName, propertiesValue) => `${propertyName}(${propertiesValue})`,
        appendAttributes: (propertyStrings, spaceOrNewLine) => `${propertyStrings.join(formats[selectFormat.value].getAttributeSeparator(oneLineFormat.checked))}${spaceOrNewLine}}`,
        finalize: (stringResult, addSquareBrackets) => addSquareBrackets ? `[${stringResult}]` : stringResult
    },
    sbf: {
        name: `Square Brackets Format`,
        options: ['optionQuotes'],
        getPrefix: (objectType, parsedObjectName) => `${objectType}: ${parsedObjectName};`,
        getValuesSeparator: () => `, `,
        getAttributeSeparator: () => `; `,
        addAttribute: (propertyName, propertiesValue) => `${propertyName}: ${propertiesValue}`,
        appendAttributes: (propertyStrings) => ` ${propertyStrings.join(formats[selectFormat.value].getAttributeSeparator())}`,
        finalize: (stringResult) => `[ ${stringResult} ]`
    },
}

let startUpdateTimer = getStartTimerFunction()

table.onkeydown = startUpdateTimer
table.onclick = startUpdateTimer
checkboxQuotes.onclick = startUpdateTimer
oneLineFormat.onclick = startUpdateTimer
squareBracketsEncasing.onclick = startUpdateTimer
objectName.onclick = startUpdateTimer
objectName.onkeydown = startUpdateTimer
objectType.onclick = startUpdateTimer
objectType.onkeydown = startUpdateTimer
selectFormat.onchange = startUpdateTimer
selectFormat.onclick = startUpdateTimer

selectFormat.onchange = () => {
    spanFormatName.innerHTML = formats[selectFormat.value].name
    const elems = document.getElementsByClassName(`formatOption`)
    for (let i = 0; i < elems.length; i++) {
        elems.item(i).hidden = !formats[selectFormat.value].options.includes(elems.item(i).id)
    }
}

function parseResult(skip_output = false) {
    const objectName = document.getElementById("objectName").value
    const objectType = document.getElementById("objectType").value
    let jsonObject = {type: objectType, name: objectName, properties: {}}
    let rowLength = table.rows.length;
    const parsedObjectName = checkboxQuotes.checked ? `"${objectName}"` : objectName

    const spaceOrNewLine = oneLineFormat.checked ? ' ' : '\n'

    let stringResult = formats[selectFormat.value].getPrefix(objectType, parsedObjectName, spaceOrNewLine)

    const propertyStrings = []
    for (let i = 1; i < rowLength - 1; i++) {
        const propertyName = document.getElementById(`input${i - 1};${0}`).value
        if (!propertyName) continue

        const propertyValues = []
        let oCells = table.rows.item(i).cells;
        let cellLength = oCells.length;

        for (let j = 1; j < cellLength - 1; j++) {
            const val = document.getElementById(`input${i - 1};${j}`).value
            if (val) {
                propertyValues.push(val)
            }
        }

        jsonObject.properties[propertyName] = propertyValues

        const propertiesValue = propertyValues
            .map(pv => checkboxQuotes.checked ? `"${pv}"` : pv)
            .join(formats[selectFormat.value].getValuesSeparator())

        propertyStrings.push(formats[selectFormat.value].addAttribute(propertyName, propertiesValue))
    }

    stringResult += formats[selectFormat.value].appendAttributes(propertyStrings, spaceOrNewLine)
    textareaOutput.value = formats[selectFormat.value].finalize(stringResult, squareBracketsEncasing.checked)
    textareaJSONOutput.value = JSON.stringify(jsonObject, null, 4)
}

function downloadJSON() {
    const json = JSON.parse(textareaJSONOutput.value)
    downloadObjectAsJson(json, `${json.type}_${json.name}`)
}

function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadFromJSON() {
    const json = JSON.parse(textareaJSONOutput.value)
    document.getElementById("objectName").value = json.name
    document.getElementById("objectType").value = json.type

    table.innerHTML = `<thead><tr id="theadCells"><th>Attribute</th><th>Value1</th></tr></thead>`

    for (let propertyName of Object.keys(json.properties)) {
        const newRow = table.insertRow()
        newRow.id = `tr${table.rows.length - 1}`

        let newCell
        newCell = newRow.insertCell()
        newCell.innerHTML = `<input id="input${table.rows.length - 2};${0}" value="${propertyName}">`
        for (let i = 0; i < json.properties[propertyName].length; i++) {
            if (i + 1 >= table.tHead.rows.item(0).cells.length) {
                const newThead = document.createElement("TH")
                newThead.innerHTML = `Value${i + 1}`
                table.tHead.rows.item(0).appendChild(newThead)
            }

            newCell = newRow.insertCell()
            newCell.innerHTML = `<input id="input${table.rows.length - 2};${i + 1}" value="${json.properties[propertyName][i]}">`
        }
    }
}




function updateTable() {
    let rowLength = table.rows.length;

    for (let i = rowLength - 1; i >= 1; i--) {
        let oCells = table.rows.item(i).cells;
        let cellLength = oCells.length;


        for (let j = cellLength - 1; j >= 0; j--) {
            const input = document.getElementById(`input${i - 1};${j}`)
            const leftInput = document.getElementById(`input${i - 1};${j - 1}`)

            // adds new line
            if (j === 0 && i === rowLength - 1 && input?.value?.trim()) {
                const newRow = table.insertRow()
                const newCell = newRow.insertCell()
                newRow.id = `tr${i}`
                newCell.innerHTML = `<input id="input${i};${0}" value="">`
            }

            // adds new cell
            if (j === cellLength - 1 && input?.value?.trim()) {
                if (j + 1 >= table.tHead.rows.item(0).cells.length) {
                    const newThead = document.createElement("TH")
                    newThead.innerHTML = `Value${j + 1}`
                    table.tHead.rows.item(0).appendChild(newThead)
                }

                const newCell = table.rows.item(i).insertCell()
                newCell.innerHTML = `<input id="input${i - 1};${cellLength}" value="">`
            } else if (j === cellLength - 1 && !input?.value?.trim() && leftInput && !leftInput?.value?.trim()) {
                table.rows.item(i).deleteCell(j)

                let maxAttributes = 0
                for (let k = 1; k < table.rows.length; k++) {
                    if (table.rows.item(k).cells.length >= maxAttributes) {
                        maxAttributes = table.rows.item(k).cells.length
                    }
                }

                if (j >= maxAttributes) {
                    table.tHead.rows.item(0).deleteCell(j)
                }
            }
        }
    }
}