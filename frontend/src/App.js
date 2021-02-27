import "./App.css";
import logo from "./contact-logo.PNG";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function App() {
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const [results, setResults] = useState([]);

  const readExcel = (file) => {
    setResults([]);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setResults(d);
      console.log(d);
    });
  };
  return (
    <div className="App">
      <header>
        <a href="https://www.contact-software.com/de/" target="_blank">
          <img src={logo} />
        </a>
        <p>
          <a
            href="https://github.com/Zelgai123/HooversDataAnalysis"
            target="_blank"
          >
            More Info
          </a>
        </p>
      </header>
      <section>
        <p>
          An intuitive and helpful tool for visualization and analysis of
          business data.
        </p>
      </section>
      <br />
      <br />
      <br />
      <section className="section_introduction">
        <p>Upload your data!</p>
        <div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
          />
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Company Name</b>{" "}
                  </TableCell>
                  <TableCell>
                    <b>Country</b>
                  </TableCell>
                  <TableCell>
                    <b>City</b>
                  </TableCell>
                  <TableCell>
                    <b> Address Line 1</b>
                  </TableCell>
                  <TableCell>
                    <b>Longitude</b>
                  </TableCell>
                  <TableCell>
                    <b>Latitude</b>
                  </TableCell>
                  <TableCell>
                    <b>Employees (All Sites)</b>
                  </TableCell>
                  <TableCell>
                    <b>Net Worth (EUR)</b>
                  </TableCell>
                  <TableCell>
                    <b>Phone</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((d) => (
                  <TableRow key={d["Company Name"]}>
                    <TableCell component="th" scope="row">
                      {d["Company Name"]}
                    </TableCell>
                    <TableCell>{d["Country/Region"]}</TableCell>
                    <TableCell>{d.City}</TableCell>
                    <TableCell>{d["Address Line 1"]}</TableCell>
                    <TableCell>{d.Longitude}</TableCell>
                    <TableCell>{d.Latitude}</TableCell>
                    <TableCell>{d["Employees (All Sites)"]}</TableCell>
                    <TableCell>{d["Net Worth (EUR)"]}</TableCell>
                    <TableCell>{d.Phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
    </div>
  );
}
