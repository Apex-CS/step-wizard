// ? STEP WIZARD CONFIG
let useAnimation = true;
const animSteps = 2; // each step to get to 100%
const delay = ms => new Promise(res => setTimeout(res, ms));

let selected = 1; // starts at step 1
let divs;

let nextButtons;
let backButtons

const emailPattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

// ? prevent submit on Enter key press
$(document).on("keypress", 'form', function (e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
        e.preventDefault();
        return false;
    }
});

// ? BOOTSTRAP SELECT PICKER INITIALIZE AND UPDATE VALIDATION WHEN BLUR
$(function () {
    $('.selectpicker').selectpicker();
    $('.selectpicker').on('blur', function () {
        var id = $(this)[0].id;
        var labels = document.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor == id) {
                labels[i].click(); // ? FORCES VALIDATION UPDATE
            }
        }
        checkForm();
    });
    $('.datepicker').datepicker();
});


function InitalConfig() {
    divs = document.querySelectorAll('.setup-content');
    nextButtons = document.querySelectorAll('.nextBtn');
    backButtons = document.querySelectorAll('.backBtn');

    // ? ADD EVENT FOR EACH NEXT BUTTON
    for (let i = 0; i < nextButtons.length; i++) {
        const nextBtn = nextButtons[i];
        nextBtn.addEventListener('click', function (e) {
            selected++;
            if (selected > divs.length + 1) {
                selected--;
            }
            UpdateStep();
        });
    }

    // ? ADD EVENT FOR EACH BACK BUTTON
    for (let i = 0; i < backButtons.length; i++) {
        const backBtn = backButtons[i];
        backBtn.addEventListener('click', function (e) {
            selected--;
            if (selected < 1) {
                selected = 1;
            }
            UpdateStep();
        });
    }

    for (let step = 0; step < divs.length; step++) {
        const index = step + 1; // ? IGNORE LAST STEP
        const buttonStep = divs[step].getElementsByClassName('nextBtn')[0];
        const inputs = document.querySelectorAll(`div#step-${index} input, div#step-${index} select, div#step-${index} textarea`);

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', () => {
                CheckInputs(index, inputs, buttonStep);
            });
        }

        $('.datepicker').on('change', function () {
            CheckInputs(index, inputs, buttonStep);
        });
    }
    Update();
    FixErrorLabel();
}

// ? ENSURES THAT THE INPUTS FROM OTHER STEPS WERE VALIDATED BEFORE CAN SUBMIT FORM
function Update() {
    if ($('#myForm') !== undefined) {
        $('#myForm input, #myForm select, #myForm textarea').on('change', checkForm); // JQuery Validate
    }
    UpdateStep();
}

/**
 * 
 * @param {*} index index of the current step
 * @param {*} inputs could be either, input, select or textarea
 * @param {*} nextBtn the next button to continue
 * @returns void
 */
function CheckInputs(index = -1, inputs, nextBtn) {
    if (index !== selected) return;
    let isValid = true;
    for (let i = 0; i < inputs.length; i++) {
        // ? ONLY REQUIRED INPUTS
        if (inputs[i].getAttribute('required') !== null) {
            if (!inputs[i].value) {
                isValid = false;
                break;
            }

            // ? check if has patterns
            const pattern = inputs[i].getAttribute('pattern');
            if (pattern) {
                const regex = RegExp(pattern, 'g');
                const result = regex.test(inputs[i].value);
                if (!result) { 
                    isValid = false;
                    break;
                }
            }

            // ? check email
            if(inputs[i].type == "email") {
                const regex = RegExp(emailPattern, 'g');
                const result = regex.test(inputs[i].value);
                if (!result) { 
                    isValid = false;
                    break;
                }
            }

            // ? check min length
            if (inputs[i].minLength && inputs[i].minLength !== -1) {
                if (inputs[i].value.length < inputs[i].minLength) {
                    isValid = false;
                    break;
                }
            }

            // ? check max length
            if (inputs[i].maxLength && inputs[i].maxLength !== -1) {
                if (inputs[i].value.length > inputs[i].maxLength) {
                    isValid = false;
                    break;
                }
            }

            // ? check min 
            if (inputs[i].min && parseFloat(inputs[i].value) < parseFloat(inputs[i].min)) {
                isValid = false;
                break;
            }

            // ? check max 
            if (inputs[i].max && parseFloat(inputs[i].value) > parseFloat(inputs[i].max)) {
                isValid = false;
                break;
            }
        }
    }

    if (selected != divs.length) {
        if(isValid) {
            nextBtn.removeAttribute('disabled');
        } else {
            nextBtn.setAttribute('disabled', false);
        }
    }
}

async function UpdateStep() {
    // ? HIDE ALL DIVS AND SHOW ONLY THE CURRENT STEP
    let current = 0;
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].getAttribute('id') == "step-" + selected) {
            divs[i].style.display = 'block';
            divs[i].style.opacity = 1;
            current = i;
        } else {
            divs[i].style.display = 'none';
            divs[i].style.opacity = 0;
        }
    }

    // ? APPLIES THE ANIMATION CONFIG FOR EACH STEP
    if (useAnimation) {
        for (let x = 0; x <= 100; x += animSteps) {
            const percent = ((x) / 100);
            divs[current].style.opacity = percent;
            await delay(1);
        }
    }

    // ? validate the inputs of the next step
    checkForm();
    // ? each time the step changes, we need to initialize the datepickers because they're hidden
    $('.datepicker').datepicker();
    FixErrorLabel();
}


// ? JQUERY VALIDATIONS, DISABLE SUBMIT BUTTON 
function checkForm() {
    var formExist = document.getElementById("myForm");

    if (formExist != null) {
        $("#myForm").validate({
            ignore: [], // ? makes sure to not ignore hidden inputs
            rules: {
                name: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: "Please specify your name",
                email: {
                    required: "We need your email address to contact you",
                    email: "Your email address must be in the format of name@domain.com"
                }
            },
            submitHandler: function (form) {
                // do other things for a valid form
                $("div.success span").html("Inputs are valid!");
                $("div.success").show();
                // form.submit();
            },
            invalidHandler: function (event, validator) {
                $("#btn-submit").prop("disabled", true);

                var errors = validator.numberOfInvalids();
                if (errors) {
                    var message = `remaining fields ${errors}`
                    $("div.error span").html(message);
                    $("div.error").show();
                    $("div.success").hide();
                } else {
                    $("div.error").hide();
                }
            }
        });

        // ? FORM IS VALID
        if (($('#myForm').valid())) {
            $("div.error").hide();
            $("#btn-submit").prop("disabled", false);
        }
    }
}

// ? Fixes jQuery validate missplaced error labels for bootstrap datepicker inputs
// ? if you are having issues with the labels displaying incorrectly, increase the setTimeout time
function FixErrorLabel() {
    setTimeout(() => {
        const dateInputs = document.querySelectorAll('.datepicker input');
        for (let i = 0; i < dateInputs.length; i++) {
            let label = document.getElementById(dateInputs[i].id + '-error');
            if (label) {
                let div = dateInputs[i].parentElement.parentElement;
                div.insertAdjacentElement('beforeend', label);
            }
        }
    }, 400);
}

// ? INPUTS TYPE FILE
// ---- change browser text on input type="file" fields
$(document).ready(function () {
    $.fn.datepicker.defaults.language = 'en';
    bsCustomFileInput.init();
});