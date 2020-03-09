import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    data: "nothing yet..."
  };

  // response.text() – read the response and return as text,
  // response.json() – parse the response as JSON,
  // response.formData() – return the response as FormData object (explained in the next chapter),
  // response.blob() – return the response as Blob (binary data with type),
  // response.arrayBuffer()

  componentDidMount() {
    fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data[0]);
        this.setState({ data: data });
      })
      .catch(error => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  render() {
    return (
      <div>
        <h1>Welcome to Meteoreactite</h1>;<p>{Object.keys(this.state.data)}</p>
        {Object.keys(this.state.data[0]).map(key => (
          <p>{`The ${key} is ${this.state.data[0][key]}.`}</p>
        ))}
      </div>
    );
  }
}

export default App;
