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
import AdjustIcon from "@material-ui/icons/Adjust";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { green } from "@material-ui/core/colors";

import {
  MapContainer,
  TileLayer,
  Popup,
  Circle,
  FeatureGroup,
} from "react-leaflet";
import { circle } from "leaflet";

export default function App() {
  const [results, setResults] = useState([]);
  const [value, setValue] = useState(30);
  const center = [53.10921096801758, 8.847594261169434];
  const [circleColor, setCircleColor] = useState("purple");
  const [radiusDependency, setRadiusDependency] = useState(
    "Employees (Single Site)"
  );

  const blueOptions = { color: "blue" };
  const secondOption = { color: circleColor };

  const handleColorChange = (event) => {
    setCircleColor(event.target.value);
  };
  const cardStringGenerator = () => {
    if (radiusDependency === "Employees (Single Site)") {
      return "Employees: ";
    } else {
      return "Revenue (EUR): ";
    }
  };
  const calculatedRadiusDependency = (d) => {
    if (radiusDependency === "Employees (Single Site)") {
      return d[radiusDependency] * 1000;
    } else {
      return d[radiusDependency] / 100;
    }
  };
  const handleDependencyChange = (event) => {
    setRadiusDependency(event.target.value);
  };

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
                <FeatureGroup pathOptions={secondOption}>
                  <Popup className="Popup">
                    <p>
                      <b>{d["Company Name"]}</b>
                    </p>
                    <b>
                      <p style={{ color: "red" }}>
                        {cardStringGenerator() + d[radiusDependency]}
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
                    radius={calculatedRadiusDependency(d) + 1200 * value}
                  />
                </FeatureGroup>
              ))}
            </MapContainer>
            <div className="body__mapsettings">
              <h2 className="body__mapsettingsheader">Map Settings</h2>
              <hr className="mapsettings__row" />
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
              <br />
              <hr className="mapsettings__row" />
              <div>
                <br />
                <div className="mapsettings__colorsetter">
                  <FormControl component="fieldset">
                    <Typography id="input-slider" gutterBottom>
                      Circle Color
                    </Typography>
                    <RadioGroup
                      aria-label="color"
                      name="color"
                      value={value}
                      onChange={handleColorChange}
                    >
                      <FormControlLabel
                        value="red"
                        control={<Radio />}
                        label="Red"
                      />
                      <FormControlLabel
                        value="purple"
                        control={<Radio />}
                        label="Purple"
                      />
                      <FormControlLabel
                        value="Green"
                        control={<Radio />}
                        label="Green"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <br />
              <hr className="mapsettings__row" />
              <div className="mapsettings__colorsetter">
                <Typography id="input-slider" gutterBottom>
                  Circle Radius Dependency
                </Typography>
                <RadioGroup
                  aria-label="color"
                  name="color"
                  value={value}
                  onChange={handleDependencyChange}
                >
                  <FormControlLabel
                    value="Employees (Single Site)"
                    control={<Radio />}
                    label="Employees (Single Site)"
                  />
                  <FormControlLabel
                    value="Revenue (EUR)"
                    control={<Radio />}
                    label="Revenue as Reported (EUR)"
                  />
                </RadioGroup>
              </div>
              <br />
              <hr className="mapsettings__row" />
              <Typography id="input-slider" gutterBottom>
                Test Setting
              </Typography>
            </div>
          </section>
          <br />
          <br />
          <div>
            <TableContainer className="table__container">
              <Table size="medium" aria-label="a dense table">
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
        </div>
      </section>
    </div>
  );
}
