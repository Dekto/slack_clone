import React from 'react';
import classNames from 'classnames';
import FormField from './FormField';
import './Form.css';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDestroyErrors = this.handleDestroyErrors.bind(this);
  }

  componentWillUnmount() {
    const { formSuccess, destroyFormSuccess } = this.props;

    if (formSuccess) {
      destroyFormSuccess();
    }

    this.handleDestroyErrors();
  }

  handleDestroyErrors() {
    const { formErrors, destroyFormErrors } = this.props;

    if (formErrors && formErrors.length) {
      destroyFormErrors();
    }
  }

  handleSubmit(e) {
    const { submitForm } = this.props;

    if (submitForm) {
      submitForm(e);
      this.handleDestroyErrors();
    }
  }

  render() {
    const {
      formSuccess,
      formErrors,
      children,
      setFieldValue,
      fields,
      submitForm,
      destroyFormSuccess,
      destroyFormErrors,
      ...props
    } = this.props;

    const hasErrors = !!(formErrors && formErrors.length);
    const formClassNames = classNames('Form', {
      'Form--success': formSuccess,
      'Form--fail': hasErrors,
    });

    return (
      <form className={formClassNames} onSubmit={this.handleSubmit} {...props}>
        {formSuccess && <div className="Form__alert Form__alert--success">{formSuccess}</div>}
        {hasErrors && (
          <ul className="Form__alert Form__alert--errors">
            {formErrors.map(err => <li key={err}>{err}</li>)}
          </ul>
        )}
        {fields && fields.map(field => (
          <FormField key={field.id} setFieldValue={setFieldValue} {...field} />
        ))}
        {children}
      </form>
    );
  }
}

export default Form;
