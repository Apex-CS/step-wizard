# Apex-CS/step-wizard
 Step wizard with javascript and jQuery

Step wizard is a flexible template to create an easy steps-form with validation on required inputs|select|textareas in each step using jQuery and Javascript
When the JavaScript checks the validation is when the input lost focus (on blur).

NOTE: uses <b>JQuery Validator</b> library to display the error messages on each invalid input.

### HTML Config
The step wizard requires a div or any other container with the attributes set to <em>class="setup-content" id="step-"<b>(step number)</b>"</em>.
It will detect if the inputs inside the div are required and disable or enable the <b>Next button</b>.

```html
<!-- STEP 1 -->
<div class="setup-content" id="step-1">
    <input required type="text" name="example" id="example" />
    <textarea required name="textarea_example" id="textarea_example"></textarea>
    <select required name="select_example" id="select_example">
       ...
    </select>
    <!-- CAN ADD MORE INPUTS HERE -->
    <button class="nextBtn" disabled type="button">Next</button>
</div>
<!-- STEP 2 -->
<div class="setup-content" id="step-2"> ... </div>
```

#### Step Buttons
The <em><b>Next</b></em> and <em><b>Back</b></em> buttons need the class <em>class="nextBtn" and class="backBtn"</em> respectively and <em><b>Next Button</b></em> <b> should be disabled by default</b>.
```html
<button class="backBtn" type="button">Back</button>
<button class="nextBtn" disabled type="button">Next</button>
```
The <em><b>Submit button</b></em> to send the form information should contain <em>id="btn-submit"</em>:
```HTML
<button id="btn-submit" disabled type="submit">Submit</button>
```
### JavaScript Config
The `main.js` contains all the JavaScript logic for the input validations, is code-commented to allow easy changes on the logic implemented to fit the needs.

additionally, you can configure set `useAnimation = true | false` to enable animation transition for each step and `animSteps = number` to set the animation speed.
```js
// Default config
let useAnimation = true;
const animSteps = 2;
```
