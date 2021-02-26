import "./App.css";
import logo from "./contact-logo.PNG";

function App() {


  return (
    <div className="App">
      <header>
        <img src={logo} />
        <p><a href="https://github.com/Zelgai123/HooversDataAnalysis">Github Repo</a></p>
      </header>
      <section>
        <p>
          An intuitive and helpful tool for visualization and analysis of
          business data.
        </p>
      </section>
      <br />
      <br />
      <section className="section_introduction">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
          repudiandae id? Ipsam mollitia laudantium ab distinctio sunt at
          dolores iste, modi id, repellat sapiente magnam optio cumque quaerat
          cupiditate rem! Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Magnam at molestiae et, aliquid quasi debitis. Quia tempora non
          distinctio voluptates adipisci odit inventore aperiam aliquam nemo. Ex
          quidem id tempora.
        </p>
        
      </section>
    </div>
  );
}

export default App