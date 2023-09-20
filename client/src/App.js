import logo from "./logo.svg";
import "./App.css";

function App() {
  const FNAME = "fname";
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    fetch("http://localhost:3001/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [FNAME]: data.get(FNAME),
        lname: data.get("lname"),
        password: data.get("password"),
        email: data.get("email"),
        address: data.get("address"),
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <form onSubmit={handleSubmit}>
          <label>
            First Name
            <input type="text" name={FNAME} />
          </label>
          <br></br>
          <label>
            Last Name
            <input type="text" name="lname" />
          </label>
          <br></br>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <br></br>
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <br></br>
          <label>
            Address
            <input type="text" name="address" />
          </label>
          <br></br>
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}
// fname, lname, password, email, address
export default App;
