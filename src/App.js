import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot from 'react-simple-chatbot';
import axios from 'axios';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      gender: '',
      age: '',
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { name, gender, age } = steps;

    this.setState({ name, gender, age });
  }

  render() {
    const { name, gender, age } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name.value}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>{gender.value}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{age.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

class SimpleForm extends Component {
  componentDidMount() {
    this.handleInitialRequest();
  }

  handleInitialRequest = async () => {
    const response = await axios.post(
      'http://localhost:5005/webhooks/rest/webhook',
      {
        message: '/get_started', // Send a specific message to initiate the conversation
      }
    );
    
    const reply = response.data[0].text;
    
    this.setState((prevState) => ({
      steps: [
        { id: 'chatbot', message: reply, trigger: 'chatbot' },
        ...prevState.steps,
      ],
    }));
  };

  handleUserMessage = async (message) => {
    const response = await axios.post(
      'http://localhost:5005/webhooks/rest/webhook',
      {
        message: message,
      }
    );
    
    const reply = response.data[0].text;
    
    this.setState((prevState) => ({
      steps: [
        ...prevState.steps,
        { id: 'chatbot', message: reply, trigger: 'chatbot' },
      ],
    }));
  };

  render() {
    return (
      <ChatBot
        handleUserMessage={this.handleUserMessage}
        steps={this.state.steps}
      />
    );
  }
}

export default SimpleForm;
