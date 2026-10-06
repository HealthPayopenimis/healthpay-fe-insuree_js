import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { withModulesManager, useModulesManager, ValidatedTextInput } from "@openimis/fe-core";
import { insureeNumberValidationCheck, insureeNumberValidationClear, insureeNumberSetValid } from "../actions";

const InsureeNumberInput = (props) => {
  const {
    value,
    onChange,
    className,
    label,
    placeholder,
    readOnly,
    required,
    isInsureeNumberValid,
    isInsureeNumberValidating,
    insureeNumberValidationError,
    insureeNumberValidationErrorMessage,
    insureeUuid,
  } = props;
  const modulesManager = useModulesManager();
  const numberMaxLength = modulesManager.getConf("fe-insuree", "insureeForm.chfIdMaxLength", 12);

  // A cached selected head's number is not proof of uniqueness for a new
  // family member. Always validate a nonempty number; only an actual existing
  // insuree UUID may exempt that same record (including its own history).
  const shouldValidate = (inputValue) => !!inputValue;

  return (
    <ValidatedTextInput
      key={insureeUuid || "new"}
      itemQueryIdentifier="insuranceNumber"
      additionalQueryArgs={insureeUuid ? { insureeUuid } : undefined}
      codeTakenLabel={insureeNumberValidationErrorMessage}
      shouldValidate={shouldValidate}
      isValid={isInsureeNumberValid}
      isValidating={isInsureeNumberValidating}
      validationError={insureeNumberValidationError}
      action={insureeNumberValidationCheck}
      clearAction={insureeNumberValidationClear}
      setValidAction={insureeNumberSetValid}
      module="insuree"
      className={className}
      readOnly={readOnly}
      required={required}
      label={label}
      placeholder={placeholder}
      value={value}
      inputProps={{ maxLength: numberMaxLength }}
      onChange={onChange}
    />
  );
};

const mapStateToProps = (state) => ({
  isInsureeNumberValid: state.insuree.validationFields?.insureeNumber?.isValid,
  isInsureeNumberValidating: state.insuree.validationFields?.insureeNumber?.isValidating,
  insureeNumberValidationError: state.insuree.validationFields?.insureeNumber?.validationError,
  insureeNumberValidationErrorMessage: state.insuree.validationFields?.insureeNumber?.validationErrorMessage,
});

export default withModulesManager(connect(mapStateToProps)(injectIntl(InsureeNumberInput)));
