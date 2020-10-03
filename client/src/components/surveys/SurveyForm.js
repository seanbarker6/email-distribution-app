//form for user to add input
import React, { Component } from "react";
import _ from "lodash";
//reduxForm is similar to connect
//Field can be used to create various html elements for
//collecting user input
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  //helper to render each of the 4 redux form fields
  renderFields() {
    //lodash creates new array containing output of each iteration
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }
  render() {
    //give field props so it nows how to render itself
    //handleSubmit is a prop given to us by the reduxForm
    //helper function defined at bottom. When we connec
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}
        >
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

//validate gets sent all field names and their inputs
function validate(values) {
  //validate must return an object
  const errors = {};
  // will contain recipients or be undefined. If undefined
  //validate will ignore
  errors.recipients = validateEmails(values.recipients || "");

  //map over fields object, and use values to access
  //values inside redux form values object
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });
  return errors;
}

export default reduxForm({
  validate,
  //redux form requires on property
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
