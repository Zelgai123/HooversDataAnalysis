import "./App.css";
import logo from "./contact-logo.PNG";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "leaflet/dist/leaflet.css";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import AdjustIcon from "@material-ui/icons/Adjust";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Switch from "@material-ui/core/Switch";
import { DataGrid } from "@material-ui/data-grid";
import {
  MapContainer,
  TileLayer,
  Popup,
  Circle,
  FeatureGroup,
} from "react-leaflet";

export default function App() {
  /*Variable and State Management*/
  const center = [53.10921096801758, 8.847594261169434];
  const columns = [
    { field: "id", headerName: "Order", width: 100 },
    { field: "Company Name", headerName: "Company Name", width: 250 },
    {
      field: "D&B Hoovers Industry",
      headerName: "D&B Hoovers Industry",
      width: 250,
    },
    { field: "Country/Region", headerName: "Country", width: 150 },
    { field: "City", headerName: "City", width: 200 },
    {
      field: "Employees (Single Site)",
      headerName: "Employees",
      sortable: false,
      width: 130,
    },
    {
      field: "Revenue (EUR) formated",
      headerName: "Revenue",
      sortable: false,
      width: 200,
    },
  ];
  const [results, setResults] = useState([]);
  const [value, setValue] = useState(30);
  const [circleColor, setCircleColor] = useState("purple");
  const blueOptions = { color: "blue" };
  const secondOption = { color: circleColor };
  const [radiusDependency, setRadiusDependency] = useState(
    "Employees (Single Site)"
  );
  const [treeSwitch, setTreeSwitch] = useState(false);

  /*Functions*/
  const handleColorChange = (event) => {
    setCircleColor(event.target.value);
  };
  const cardStringGenerator = () => {
    if (radiusDependency === "Employees (Single Site)") {
      return "Employees: ";
    } else {
      return "Revenue: ";
    }
  };
  const calculatedRadiusDependency = (d) => {
    if (radiusDependency === "Employees (Single Site)") {
      if (d[radiusDependency] === "n/a") {
        return 0;
      } else {
        return d[radiusDependency] * 5;
      }
    } else {
      if (d[radiusDependency] < 300000000) {
        return d[radiusDependency] / 100000;
      } else {
        return 3000;
      }
    }
  };
  const handleTreeSwitchChange = (event) => {
    setTreeSwitch(!event.target.checked);
    console.log(treeSwitch);
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
  const cardEuroFunction = () => {
    if (radiusDependency === "Revenue (EUR)") {
      return "Revenue (EUR) formated";
    } else {
      return "Employees (Single Site)";
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
      let i = 1;
      d.map(function (obj) {
        if (obj["Order"] != null) {
          obj["id"] = obj["Order"];
        } else {
          obj["id"] = i;
          i = i + 1;
        }
      });
      d.map(function (obj) {
        if (obj["Employees (Single Site)"] === "") {
          obj["Employees (Single Site)"] = "n/a";
        }
      });

      d.map(function (obj) {
        obj["Revenue (EUR) formated"] = new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(obj["Revenue (EUR)"]);
      });
      setResults(d);
      console.log(d);
    });
  };

  /*Component Definition*/
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
                <Circle center={center} radius={1500000 * (value / 1000)} />
              </FeatureGroup>
              {results.map((d) => (
                <FeatureGroup pathOptions={secondOption}>
                  <Popup className="Popup">
                    <p>
                      <b>{d["Company Name"]}</b>
                    </p>
                    <b>
                      <p style={{ color: "red" }}>
                        {cardStringGenerator() + d[cardEuroFunction()]}
                      </p>
                    </b>

                    <hr />
                    <p>
                      <i>
                        {d["Country/Region"] + "; "}
                        {d["City"] + "; "}
                        {d["Address Line 1"]}
                      </i>
                      <br />
                      <p>{d["Business Description"]}</p>
                    </p>
                  </Popup>
                  <Circle
                    center={[d.Latitude, d.Longitude]}
                    radius={calculatedRadiusDependency(d) + 6000 * value}
                  />
                </FeatureGroup>
              ))}
            </MapContainer>
            <div className="body__mapsettings">
              <h2 className="body__mapsettingsheader">Map Settings</h2>
              <hr className="mapsettings__row" />
              <br/>
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
              <br/>
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
                    label="Revenue (EUR)"
                  />
                </RadioGroup>
              </div>
              
            </div>
          </section>
          <br />
          <br />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={results}
              columns={columns}
              pageSize={10}
              checkboxSelection
            />
          </div>
        </div>
      </section>
    </div>
  );
}
