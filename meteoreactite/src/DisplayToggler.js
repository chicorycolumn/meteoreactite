import React, { Component } from "react";

class DisplayToggler extends Component {
  state = { isDisplayed: true };

  toggleButton = () => {
    this.setState(currentState => {
      return { isDisplayed: !currentState.isDisplayed };
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleButton}>
          {this.state.isDisplayed ? "hide" : "show"}
        </button>{" "}
        {this.state.isDisplayed && this.props.children}
      </div>
    );
  }
}

export default DisplayToggler;
