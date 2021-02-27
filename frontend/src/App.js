import "./App.css";
import logo from "./contact-logo.PNG";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [results, setResults] = useState([]);

  const readExcel = (file) => {
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
      console.log(d)
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

          <table class="table container">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">Company Name</th>
              </tr>
            </thead>
            <tbody>
              {results.map((d) => (
                <tr key={d.City}>
                  <th>{d.City}</th>
                  <td>{d.CompanyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
