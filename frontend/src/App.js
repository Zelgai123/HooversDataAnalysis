import "./App.css";
import logo from "./contact-logo.PNG";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import "leaflet/dist/leaflet.css";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import AdjustIcon from '@material-ui/icons/Adjust';

import {
  MapContainer,
  TileLayer,
  Popup,
  Circle,
  FeatureGroup,
} from "react-leaflet";

export default function App() {
  const [results, setResults] = useState([]);
  const [value, setValue] = useState(30);
  const center = [53.10921096801758, 8.847594261169434];

  const purpleOptions = { color: "purple" };
  const blueOptions = { color: "blue" };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

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
          <img src={logo} alt="Contact Logo" />
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
          <br />
          <br />
          <section className="body__map">
            <MapContainer
              className="MapContainer"
              center={center}
              zoom={3}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FeatureGroup pathOptions={blueOptions}>
                <Popup className="Popup">
                  <a
                    href="https://www.contact-software.com/de/"
                    target="_blank"
                  >
                    <img src={logo} alt="Contact Logo" />
                  </a>
                  <p>
                    <b>Contact Software</b>
                  </p>
                </Popup>
                <Circle center={center} radius={200000} />
              </FeatureGroup>
              {results.map((d) => (
                <FeatureGroup pathOptions={purpleOptions}>
                  <Popup className="Popup">
                    <p>
                      <b>{d["Company Name"]}</b>
                    </p>
                    <b>
                      <p style={{ color: "red" }}>
                        {"Employees: " + d["Employees (Single Site)"]}
                      </p>
                    </b>

                    <hr />
                    <p>
                      <i>
                        {d["Country/Region"] + "; "}
                        {d["City"] + "; "}
                        {d["Address Line 1"]}
                      </i>
                    </p>
                  </Popup>
                  <Circle
                    center={[d.Latitude, d.Longitude]}
                    radius={d["Employees (Single Site)"] * 50 + 1200 * value}
                  />
                </FeatureGroup>
              ))}
            </MapContainer>
            <div className="body__mapsettings">
              <h2 className="body__mapsettingsheader">Map Settings</h2>
              <hr className ="mapsettings__row" />
              <div className="mapRadiusSettings">
                <Typography id="input-slider" gutterBottom>
                  Circle Radius
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <AdjustIcon />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={typeof value === "number" ? value : 0}
                      onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      value={value}
                      margin="dense"
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 10,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
              <br/>
              <hr className="mapsettings__row"/>
              <div>

              </div>
            </div>
          </section>

          <br />
          <br />
          <TableContainer className="table__container">
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
                    <b>Address</b>
                  </TableCell>
                  <TableCell>
                    <b>Longitude</b>
                  </TableCell>
                  <TableCell>
                    <b>Latitude</b>
                  </TableCell>
                  <TableCell>
                    <b>Employees (Single Site)</b>
                  </TableCell>
                  <TableCell>
                    <b>Revenue as Reported (EUR)</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((d) => (
                  <TableRow key={d.Order}>
                    <TableCell component="th" scope="row">
                      {d["Company Name"]}
                    </TableCell>
                    <TableCell>{d["Country/Region"]}</TableCell>
                    <TableCell>{d.City}</TableCell>
                    <TableCell>{d["Address Line 1"]}</TableCell>
                    <TableCell>{d.Longitude}</TableCell>
                    <TableCell>{d.Latitude}</TableCell>
                    <TableCell>{d["Employees (Single Site)"]}</TableCell>
                    <TableCell>{d["Revenue (EUR)"]}</TableCell>
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
