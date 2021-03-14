import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { UserContext } from "./UserProvider";

Modal.setAppElement("#__next");

interface NameModalProps {
  showModal: boolean;
  firstName: string;
  lastName: string;
  hide: () => void;
  confirm: (newData: {firstName: string, lastName: string}) => void;
}

interface NameModalState {
  firstName: string;
  lastName: string;
}


class NameModal extends React.Component<NameModalProps, NameModalState> {
  private firstNameInput;
  state = {
    firstName: this.props.firstName || "",
    lastName: this.props.lastName || ""
  };

  handleKeyPress = e => {
    const { hide, confirm } = this.props;
    if (e.key === "Enter") {
      confirm({firstName: this.state.firstName, lastName: this.state.lastName});
      hide();
    }
  };

  handleFirstNameInput = e => {
    this.setState({ firstName: e.target.value });
  };

  handleLastNameInput = e => {
    this.setState({ lastName: e.target.value });
  };

  render() {
    const { showModal, hide, confirm } = this.props;
    return (
      <Modal
        isOpen={showModal}
        onAfterOpen={() => this.firstNameInput.focus()}
        onRequestClose={hide}
        style={customStyles}
        contentLabel="Text edit Modal"
      >
        <Close onClick={hide}>X</Close>
        <label htmlFor="first-name">
          First name
          <NameInput
            type="text"
            id="first-name"
            placeholder="First name"
            value={this.state.firstName}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleFirstNameInput}
            ref={el => (this.firstNameInput = el)}
          />
        </label>
        <br />
        <label htmlFor="last-name">
          Last name
          <NameInput
            type="text"
            id="last-name"
            placeholder="Last name"
            value={this.state.lastName}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleLastNameInput}
          />
        </label>
        <br />
        <CancelButton onClick={hide}>Cancel</CancelButton>
        <ConfirmButton
          onClick={() => {
            confirm({  firstName: this.state.firstName, lastName: this.state.lastName  });
            hide();
          }}
        >
          Ok
        </ConfirmButton>
      </Modal>
    );
  }
}

export default NameModal;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 5px 12px 0 rgba(0,0,0,0.25)",
    padding: "30px"
  }
};

const NameInput = styled.input`
  margin: 1em;
`;

const Close = styled.button`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  margin: 0.3rem;
  font-weight: 700;
  border-radius: 2px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  background: rgba(0, 0, 0, 0);
  border: 0;
`;

const ConfirmButton = styled.button`
  float: right;
  color: white;
  cursor: pointer;
  border: 0;
  background: hsl(120, 55%, 45%);
  border-radius: 2px;
  padding: 0 15px;
  height: 35px;
  margin: 0.5em;
`;
const CancelButton = styled.button`
  float: right;
  color: white;
  cursor: pointer;
  border: 0;
  background: hsl(0, 78%, 51%);
  border-radius: 2px;
  padding: 0 15px;
  height: 35px;
  margin: 0.5em;
`;

NameModal.contextType = UserContext;
