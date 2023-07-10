import "./Login.scss";
import axios from "axios";
import { Line } from "react-chartjs-2";
import AppInput from "../../Components/AppInput";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContextProvider";

export default function Login() {
  const { Login } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    accountNumber: null,
    password: "",
  });
  const [chartData, setChartData] = useState({});

  const handleChange = (e) => {
    e.preventDefault();

    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Login(inputs);

      Navigate("/home");
    } catch (error) {
      const { accountNumber, password } = inputs;

      if (!accountNumber || !password) {
        return setError("Enter Valid Credentials");
      }
      console.log(error.response.data);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/klines",
          {
            params: {
              symbol: "BTCUSDT",
              interval: "1h",
              limit: 24,
            },
          }
        );

        const data = response.data.map((item) => ({
          x: new Date(item[0]),
          y: parseFloat(item[1]),
        }));

        setChartData({
          datasets: [
            {
              label: "Bitcoin Price",
              data,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="login">
        <div className="login-top">
          <div className="left">
            <h1>Welcome to Prestige Bank</h1>
            <h2>THE FUTURE OF ONLINE BANKING</h2>
            <h3>
              Take control of your financial future and join Prestige Bank
              today. Our cryptocurrency banking platform offers a secure,
              user-friendly, and comprehensive solution for managing your
              digital assets. Whether you're a seasoned investor or a curious
              beginner, we are here to empower you with the tools and resources
              you need to thrive in the world of cryptocurrencies.
            </h3>

            <Link to={"/register"} style={{ textDecoration: "none" }}>
              <h4>Get Started</h4>
            </Link>
          </div>

          <div className="right">
            <form action="submit">
              <p>Login</p>
              <AppInput
                type="number"
                name="accountNumber"
                onchange={handleChange}
                placeholder="Account Number"
              />
              <AppInput
                type="password"
                name="password"
                onchange={handleChange}
                placeholder="Password"
              />

              {error && (
                <p style={{ position: "absolute", top: 500, fontSize: "1rem" }}>
                  {error}
                </p>
              )}
              <button onClick={handleSubmit} type="submit">
                Login
              </button>
            </form>
          </div>
        </div>

        <div className="login-mid">
          <div className="left"></div>

          <div className="right"></div>
        </div>

        <div className="login-mid2">
          <div className="left">
            <Line data={chartData} />;
          </div>

          <div className="right">
            <div className="top-bar">
              <div className="left-top-bar"></div>
              <div className="right-top-bar"></div>
            </div>
            <div className="bottom-bar"></div>
          </div>
        </div>

        <div className="login-end">
          <div className="left"></div>

          <div className="right"></div>
        </div>
      </div>
    </>
  );
}
