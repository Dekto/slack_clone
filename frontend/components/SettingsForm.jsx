import React from 'react';
import Button from './Button';
import withForm from './withForm';
import FormHandler from './FormHandler';
import './SettingsForm.css';

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: null,
      username: '',
      email: '',
    };

    this.handleFieldValueChange = this.handleFieldValueChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;

    this.setState({
      username: user.username,
      email: user.email,
    });
  }

  handleFieldValueChange(value, prop) {
    this.setState({ [prop]: value });
  }

  handleFileChange(e) {
    const avatar = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({ avatar });
    };

    if (avatar) {
      reader.readAsDataURL(avatar);
    }
  }

  resetForm(formData, formNode) {
    this.setState({ avatar: null });

    formData.forEach((_, key) => {
      formData.delete(key);
    });

    const inputNode = formNode.querySelector('#avatar');
    inputNode.value = '';
  }

  handleSubmit(e) {
    e.preventDefault();

    const { formDispatchRequest } = this.props;
    const { ...state } = this.state;

    const formData = new FormData();
    Object.keys(state).forEach((key) => {
      formData.append(`user[${key}]`, state[key]);
    });

    formDispatchRequest(formData);
    this.resetForm(formData, e.target);
  }

  render() {
    const {
      closeModal,
      user,
      form: { formSuccess, formErrors },
    } = this.props;
    const { username, email } = this.state;

    console.log(formErrors);

    const fields = [
      {
        id: 'username',
        type: 'text',
        name: 'user[username]',
        value: username,
        label: 'Username',
      },
      {
        id: 'email',
        type: 'text',
        name: 'user[email]',
        value: email,
        label: 'Email',
      },
      {
        id: 'avatar',
        type: 'file',
        name: 'user[avatar]',
        className: null,
        accept: 'image/*',
        onChange: this.handleFileChange,
        label: 'Upload avatar',
      }
    ];

    return (
      <div className="SettingsForm" onSubmit={this.handleSubmit}>
        <div className="SettingsForm__col">
          <FormHandler
            fields={fields}
            submitForm={this.handleSubmit}
            setFieldValue={this.handleFieldValueChange}
            success={formSuccess}
            errors={formErrors}
          >
            <Button type="submit" color="green" size="lg">
              Save
            </Button>
            <Button onClick={() => closeModal()} size="lg">
              Cancel
            </Button>
          </FormHandler>
        </div>
        <div className="SettingsForm__col">
          <img src={user.avatarLarge} alt={`${user.username} banner`} />
        </div>
      </div>
    );
  }
}

const formProps = { type: 'USER_UPDATE_REQUEST', payloadName: 'user' };

export default withForm(formProps)(SettingsForm);
