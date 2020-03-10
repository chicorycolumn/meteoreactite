/** @format */

import React from "react";
import styled from "styled-components";
import "./App.css";
import { useTable } from "react-table";

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

function SuperTable(props) {
  let newData = props.data;
  console.log(newData);

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

class App extends React.Component {
  state = {
    data: "nothing yet..."
  };

  fetchMeteors = (queryString = "") => {
    fetch("https://data.nasa.gov/resource/gh4g-9sfh.json" + queryString)
      .then(response => {
        // console.log(response.json());
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        console.log(data.length);
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

        this.setState({ data: formattedData });
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
        <h1>Welcome to Meteoreactite</h1>;<p>{Object.keys(this.state.data)}</p>
        {Object.keys(this.state.data[0]).map(key => (
          <p>{`The ${key} is ${this.state.data[0][key]}.`}</p>
        ))}
        <SuperTable data={this.state.data} fetchMeteors={this.fetchMeteors} />
      </div>
    );
  }
}

export default App;
