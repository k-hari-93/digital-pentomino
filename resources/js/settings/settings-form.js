class SettingsForm {

    // === === === GENERATE FORM === === ===
    static generateForm(formElement, schema, onSubmit) {

        SettingsForm.createForm(formElement, schema);

        formElement.appendChild(SettingsForm.createSubmitButton());

        $(formElement).submit(function(event) {
            let schema = SettingsSchemaSingleton.getInstance().getSettingsSchema();
            let data = SettingsForm.collectDataFromForm(formElement, schema);
            console.log(data);
            event.preventDefault();
            onSubmit(false, data);
        });
    }

    // --- --- --- Form Creation --- --- ---
    static createForm(formElement, schema) {
        let enteredAdvancedSettings = false;
        let advancedSettingsDiv = document.createElement("div");
        advancedSettingsDiv.style.display = "none";

        let htmlElement = formElement;

        for (let heading in schema) {
            let subSettings = schema[heading].properties;

            if (!enteredAdvancedSettings && schema[heading].advanced) {
                enteredAdvancedSettings = true;
                htmlElement = advancedSettingsDiv;

                let button = document.createElement("button");
                button.type = "button";
                button.innerHTML = "SHOW ADVANCED SETTINGS";
                button.className = "collapsible";

                button.addEventListener("click", function() {
                    this.classList.toggle("active");
                    let content = this.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } else {
                        content.style.display = "block";
                    }
                });

                formElement.appendChild(button);
            }

            htmlElement.appendChild(SettingsForm.createHeader("h3", schema[heading].title));
            htmlElement.appendChild(document.createElement("br"));

            for (let key in subSettings) {
                let elementName = heading + "." + key;

                let settingsEntry = subSettings[key];
                let settingsEntryType = settingsEntry.type;

                let div = document.createElement("div");
                htmlElement.appendChild(div);

                switch (settingsEntryType) {
                    case "boolean":
                        let checkbox = SettingsForm.createInputElement("checkbox", elementName);
                        div.appendChild(checkbox);
                        let label = SettingsForm.createLabel(settingsEntry.title, {
                            for: checkbox.id
                        });
                        div.appendChild(label);
                        break;
                    case "string":
                        let selectElementLabel = SettingsForm.createLabel(settingsEntry.title);
                        div.appendChild(selectElementLabel);
                        if (settingsEntry.imgPaths === undefined) {
                            let selectElement = SettingsForm.createSelectElement(
                                elementName,
                                settingsEntry.enum,
                                settingsEntry.enumText);
                            div.appendChild(selectElement);
                        } else {
                            let imgElement = SettingsForm.createImgSelectElement(
                                elementName,
                                settingsEntry.enum,
                                settingsEntry.enumText,
                                settingsEntry.imgPaths
                            );
                            div.appendChild(imgElement);
                        }
                        break;
                    case "integer":
                        let integerInputElementLabel = SettingsForm.createLabel(settingsEntry.title);
                        div.appendChild(integerInputElementLabel);
                        let integerInputElement = SettingsForm.createInputElement("number", elementName, {
                            step: 1,
                            value: 3,
                            min: settingsEntry.minimum,
                            max: settingsEntry.maximum
                        });
                        div.appendChild(integerInputElement);
                        break;
                    case "number":
                        let numberInputElementLabel = SettingsForm.createLabel(settingsEntry.title);
                        div.appendChild(numberInputElementLabel);
                        let numberInputElement = SettingsForm.createInputElement("number", elementName, {
                            step: 0.1,
                            value: 1.5,
                            min: settingsEntry.minimum,
                            max: settingsEntry.maximum
                        });
                        div.appendChild(numberInputElement);
                        break;
                    default:
                        throw new Error("Unknown type: " + settingsEntryType);
                }

                if (!(settingsEntry.description === undefined)) {
                    div.appendChild(document.createElement("br"));
                    let descriptionLabel = SettingsForm.createLabel(settingsEntry.description);
                    div.appendChild(descriptionLabel);
                }
                div.appendChild(document.createElement("br"));
            }
        }

        formElement.appendChild(advancedSettingsDiv);
    }

    static createHeader(type, text) {
        let header = document.createElement(type);
        header.innerHTML = text;
        return header;
    }

    static createInputElement(type, name, options) {
        let inputElement = document.createElement("input");
        inputElement.setAttribute("type", type);
        inputElement.name = name;
        inputElement.id = name;

        if (!(options === undefined)) {
            for (let [key, value] of Object.entries(options)) {
                inputElement.setAttribute(key, value);
            }
        }

        return inputElement;
    }

    static createLabel(text, options) {
        let labelElement = document.createElement("label");
        labelElement.innerHTML = text;

        if (!(options === undefined)) {
            for (let [key, value] of Object.entries(options)) {
                labelElement.setAttribute(key, value);
            }
        }

        return labelElement;
    }

    static createSelectElement(name, enumElements, enumTexts) {
        let selectElement = document.createElement("select");
        selectElement.name = name;
        selectElement.id = name;

        for (let i = 0; i < enumElements.length; i++) {
            let optionElement = document.createElement("option");
            optionElement.innerHTML = enumTexts[i];
            optionElement.value = enumElements[i];
            selectElement.appendChild(optionElement);
        }

        return selectElement;
    }

    static createImgSelectElement(name, enumElements, enumTexts, imgPaths) {
        let div = document.createElement("div");
        div.value = enumElements[0];
        div.setAttribute("name", name);
        div.id = name;

        let i = 0;
        imgPaths.forEach(imgPath => {
            let buttonElement = document.createElement("button");
            buttonElement.type = "button";
            buttonElement.style = "height:10vw;width:10vw;background:url(" + imgPath + ");background-size: 100%;";
            let enumElement = enumElements[i];
            buttonElement.onclick = () => {
                div.value = enumElement;
            };
            div.appendChild(buttonElement);
            i++;
        });

        return div;
    }

    static createSubmitButton() {
        let submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.innerHTML = "Submit";
        return submitButton;
    }

    // --- --- --- Data collection --- --- ---
    static collectDataFromForm(formElement, schema) {
        let result = {};

        for (let heading in schema) {
            let subSettings = schema[heading].properties;
            result[heading] = {};
            for (let key in subSettings) {
                let name = heading + "." + key;

                let settingsEntry = subSettings[key];
                let settingsEntryType = settingsEntry.type;
                switch (settingsEntryType) {
                    case "boolean":
                        let checkBoxElement = $(formElement).find("input[name='" + name + "']")[0];
                        result[heading][key] = checkBoxElement.checked;
                        break;
                    case "string":
                        if (settingsEntry.imgPaths === undefined) {
                            let selectElement = $(formElement).find("select[name='" + name + "']")[0];
                            result[heading][key] = selectElement.value;
                        } else {
                            let divElement = $(formElement).find("div[name='" + name + "']")[0];
                            result[heading][key] = divElement.value;
                        }
                        break;
                    case "integer":
                        let integerInputElement = $(formElement).find("input[name='" + name + "']")[0];
                        result[heading][key] = parseInt(integerInputElement.value);
                        break;
                    case "number":
                        let numberInputElement = $(formElement).find("input[name='" + name + "']")[0];
                        result[heading][key] = parseFloat(numberInputElement.value);
                        break;
                    default:
                        throw new Error("Unknown type: " + settingsEntryType);
                }
            }
        }

        return result;
    }

    // === === === UPDATE FORM === === ===
    static updateForm(formElement) {
        let schema = SettingsSchemaSingleton.getInstance().getSettingsSchema();
        let settings = SettingsSingleton.getInstance().getSettings();

        //change default values according to current schema
        for (let key in settings) {
            //console.log(settings[key]);
            for (let subkey in settings[key]) {
                //console.log(settings[key][subkey]);
                let schemaEntry = schema[key]["properties"][subkey];
                switch (schemaEntry.type) {
                    case "boolean":
                        SettingsForm.editBooleanSchemaEntry(key, subkey, settings[key][subkey], formElement);
                        break;
                    case "number": case "integer":
                        SettingsForm.editInputSchemaEntry(key, subkey, settings[key][subkey], formElement);
                        break;
                    case "string":
                        if (schemaEntry.imgPaths === undefined) {
                            SettingsForm.editStringSchemaEntry(key, subkey, schemaEntry, settings[key][subkey], formElement);
                        } else {
                            SettingsForm.updateImgSelectElement(key, subkey, schemaEntry, settings[key][subkey], formElement);
                        }
                        break;
                    default:
                        throw new Error("Schema Error: Unknown type: " + schemaEntry.type);
                }
            }
        }
        let currentLanguage = settings.general.language;
        schema["general"]["properties"]["language"]["default"] = currentLanguage === baseConfigs.languages.ENGLISH ? "en" : "de";
    }

    static editBooleanSchemaEntry(heading, key, value, formElement) {
        let name = heading + "." + key;
        let inputElement = $(formElement).find("input[name='" + name + "']")[0];
        inputElement.checked = value;
    }

    static editInputSchemaEntry(heading, key, value, formElement) {
        let name = heading + "." + key;
        let inputElement = $(formElement).find("input[name='" + name + "']")[0];
        inputElement.value = value;
    }

    static editStringSchemaEntry(heading, key, schemaEntry, selectedValue, formElement) {
        let selectName = heading + "." + key;
        let enumText = schemaEntry.enumText;
        if (enumText === undefined) {
            throw new Error("No enumText defined");
        }
        let selectElement = $(formElement).find("select[name='" + selectName + "']")[0];
        if (!(selectElement.options.length === enumText.length)) {
            throw new Error("Number of elements does not match number of texts specified in enumText");
        }

        if (heading === "general" && key === "language") {
            selectedValue = selectedValue === baseConfigs.languages.ENGLISH ? "en" : "de";
        }

        let selectedOption = null;
        for (let i = 0; i < selectElement.options.length; i++) {
            let option = selectElement.options[i];
            if (option.value === selectedValue) {
                selectedOption = option;
            }
        }
        selectedOption.selected = true;
    }

    static updateImgSelectElement(heading, key, schemaEntry, selectedValue, formElement) {
        let divName = heading + "." + key;
        let enumText = schemaEntry.enumText;
        if (enumText === undefined) {
            throw new Error("No enumText defined");
        }
        let divElement = $(formElement).find("select[div='" + divName + "']")[0];
        // if (!(divElement.chil.length === enumText.length)) {
        //    throw new Error("Number of elements does not match number of texts specified in enumText");
        //}

        if (heading === "general" && key === "language") {
            selectedValue = selectedValue === baseConfigs.languages.ENGLISH ? "en" : "de";
        }

        // TODO: select image
    }
}
