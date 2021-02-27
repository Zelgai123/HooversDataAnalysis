import "./App.css";
import logo from "./contact-logo.PNG";

export default function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} />
        <p>
          <a href="https://github.com/Zelgai123/HooversDataAnalysis">
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
        <form action="">
          <input type="file" />
          <br />
          <br />
          <button type="submit" form="form1" value="Submit">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
