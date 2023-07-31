import intl from "react-intl-universal";

// Must begin with a valid country code, followed by a space
const phoneStart =
  /^(1|7|20|27|30|31|32|33|34|36|39|40|41|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|60|61|62|63|64|65|66|81|82|84|86|90|91|92|93|94|95|98|211|212|213|216|218|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|248|249|250|251|252|253|254|255|256|257|258|260|261|262|263|264|265|266|267|268|269|290|291|297|298|299|350|351|352|353|354|355|356|357|358|359|370|371|372|373|374|375|376|377|378|379|380|381|382|383|385|386|387|389|420|421|423|500|501|502|503|504|505|506|507|508|509|590|591|592|593|595|597|598|599|670|672|673|674|675|676|677|678|679|680|681|682|683|685|686|687|688|689|690|691|692|850|852|853|855|856|880|886|960|961|962|963|964|965|966|967|968|970|971|972|973|974|975|976|977|992|993|994|995|996|998|1-?684|1-?264|1-?268|1-?242|1-?246|1-?441|1-?284|1-?345|1-?767|1-?809|1-?829|1-?849|1-?473|1-?671|44-?1481|44-?1624|1-?876|44-?1534|1-?664|1-?670|1-?787|1-?939|1-?869|1-?758|1-?784|1-?721|1-?868|1-?649|1-?340)\s+/;
// Must contain at least 4 characters after the country code
const phoneEnd = /\s.{4,}/;

/**
 * Given an amount and currency, returns a string to display.
 *
 * @param {String} type - the field type
 * @param {String} value - the value to validate
 */
export function validateField(type, value) {
  value = value && value.trim && value.trim();

  const result = {
    valid: true,
    helperText: "",
  };

  if (type === "phone") {
    if (!phoneStart.test(value)) {
      result.valid = false;
      result.helperText = intl
        .get("validation.helper.phone.startWith")
        .defaultMessage(
          "must start with a valid country code followed by a space"
        );
    } else if (!phoneEnd.test(value)) {
      result.valid = false;
      result.helperText = intl
        .get("validation.helper.phone.endWith")
        .defaultMessage("invalid phone number");
    }
  }

  return result;
}

/**
 * Validates an element, returns an object containing if it was valid, as well as error
 * and helper text properties for the specific input.
 *
 * @param {Node} element - the DOM node of the element to validate
 * @param {Object} validationProps - an object specifying validation properties to fields by name
 * @param {Object} otherFields - an object mapping fields key:value pairs (used to validate matching fields, i.e. confirm password)
 */
export function validateElement(element, validationProps, otherFields) {
  const { name, value } = element;

  // Initialize Validity and Helper Text
  let valid = true;
  let helperText = "";

  // Get the validation properties
  const validation = validationProps[name];
  // If there is validation, and it is required OR has a value
  // (an empty string is not invalid unless the field is required)
  if (validation && (validation.required || value !== "")) {
    if (validation.type) {
      // Match validation type
      const { valid: _valid, helperText: _helperText } = validateField(
        validation.type,
        value
      );
      valid = _valid;
      helperText = _helperText;
    }
    if (valid) {
      if (validation.required && !value) {
        // Required
        valid = false;
        helperText = intl
          .get("validation.helper.requiredField")
          .defaultMessage("required");
      } else if (validation.match && value !== otherFields[validation.match]) {
        // Match another field (i.e. confirm password)
        valid = false;
        helperText = intl
          .get("validation.helper.matchField")
          .defaultMessage("does not match");
      } else if (validation.pattern && !validation.pattern.test(value)) {
        // Match pattern
        valid = false;
        helperText = intl
          .get("validation.helper.invalidFormat")
          .defaultMessage("invalid format");
      } else if (validation.min && value.length < validation.min) {
        // Minimum Characters
        valid = false;
        helperText = intl
          .get("validation.helper.tooFewChars")
          .defaultMessage("too few characters");
      } else if (validation.max && value.length > validation.max) {
        // Maximum Characters
        valid = false;
        helperText = intl
          .get("validation.helper.tooManyChars")
          .defaultMessage("too many characters");
      }
    }
  }

  const newState = {
    valid,
    inputProps: {
      [`${name}Error`]: !valid,
      [`${name}HelperText`]: helperText,
    },
  };

  return newState;
}
