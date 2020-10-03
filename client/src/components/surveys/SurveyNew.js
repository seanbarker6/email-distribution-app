//SurveyNew shows surveyForm and SurveyFormReview
import React, { Component } from "react";
import { reduxForm } from 'redux-form';
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";

class SurveyNew extends Component {
  //local state to determine whether to laod review page or
  //input page
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return <SurveyFormReview
        onCancel={() => this.setState({ showFormReview: false })}
      />;
    }

    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

//create new reduxForm so that when leave original/other form page
//the values are chucked out
//When we leave/unmount this or surveyForm component, the parent
//unmounts first and hence we get his forms unmounting behaviour
//which causes values to be thrown out as didnt specify destroyOnUnmount
export default reduxForm({
  form: 'surveyForm',
})(SurveyNew);
