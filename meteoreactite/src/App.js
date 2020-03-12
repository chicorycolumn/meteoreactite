import { Router } from "@reach/router";
import styled from "styled-components";
import "./App.css";
import { useTable } from "react-table";
import React, { Component } from "react";
import DisplayToggler from "./DisplayToggler";

class App extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <DisplayToggler>
          <Header />
        </DisplayToggler>
        <Router>
          <Meteorites path="/" />
        </Router>
      </div>
    );
  }
}

class Meteorites extends Component {
  state = { data: "nothing yet..." };

  fetchMeteors = (queryString = "") => {
    fetch("https://data.nasa.gov/resource/gh4g-9sfh.json" + queryString)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const formattedData = [];
        data.forEach(meteor =>
          formattedData.push({
            ...meteor,
            year:
              meteor.year !== undefined
                ? new Date(meteor.year.toString()).getFullYear()
                : "No data"
          })
        );

        this.setState({ data: formattedData.slice(0, 20) });
      })
      .catch(error => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  componentDidMount() {
    this.fetchMeteors();
  }

  render() {
    return (
      <div>
        <DisplayToggler>
          <SuperTable data={this.state.data} fetchMeteors={this.fetchMeteors} />
        </DisplayToggler>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div>
        <h1>So this is Meteoreactite</h1>
      </div>
    );
  }
}

function SuperTable(props) {
  let newData = props.data;
  function handleFoundButton(keyword, event) {
    props.fetchMeteors(`?fall=${keyword}`);
  }

  const columns = [
    {
      Header: "Meteorites",
      columns: [
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Name Type",
          accessor: "nametype"
        },
        {
          Header: "Class",
          accessor: "recclass"
        },
        {
          Header: "Mass(g)",
          accessor: "mass"
        },
        {
          Header: (
            <div>
              <button
                onClick={() => {
                  handleFoundButton("Found");
                }}
              >
                Found
              </button>
              <button
                onClick={() => {
                  handleFoundButton("Fell");
                }}
              >
                Fell
              </button>
            </div>
          ),
          accessor: "fall"
        },
        {
          Header: "Year",
          accessor: "year"
        },
        {
          Header: "Latitude",
          accessor: "reclat"
        },
        {
          Header: "Longlitude",
          accessor: "reclong"
        }
      ]
    }
  ];
  if (Array.isArray(newData)) {
    return (
      <Styles>
        <Table columns={columns} data={newData} />
      </Styles>
    );
  } else return <p>loading...</p>;
}

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // data = data.filter((meteor) => meteor.fall === "Found");
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default App;
