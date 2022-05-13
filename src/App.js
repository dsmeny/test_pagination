/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useReducer } from "react";
import { timeSeriesReducer } from "./timeSeries.reducer";
import "./App.css";

const StockItem = ({ items }) => {
  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: "2rem",
    },
  };
  return (
    <ul style={styles.wrapper}>
      {items.map((el, index) => (
        <li key={index}>{el}</li>
      ))}
    </ul>
  );
};

const StockList = ({ pState, stocks, clickHandler }) => {
  const { page, pp, plength } = pState;
  const array = [...Array(Math.round(plength / pp))];
  const pages = array.reduce((curr, num, index) => {
    if (array.indexOf(array.length) && (plength / pp) % 2 !== 0) {
      return [...curr, index + 1];
    }
  }, []);

  const lowerBound = page === 0 ? page : pp * page;
  const upperBound = page === 0 ? pp : lowerBound + pp;

  const stockdata = stocks.slice(lowerBound, upperBound);
  const headers = ["date", "open", "high", "low", "close", "volume"];

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "column",
    },
    content: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      Transition: "all 1s ease",
    },
    list: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: "2rem",
      Transition: "all 1s ease",
    },
  };

  return (
    <div>
      <ul style={styles.wrapper} className="fade">
        <StockItem items={headers} />
        {stockdata.map((entry, index) => (
          <li style={styles.content} key={index}>
            <span>{entry[0]}</span>
            <StockItem items={Object.values(entry[1])} />
          </li>
        ))}
      </ul>
      <div style={styles.content}>
        <button onClick={clickHandler} disabled={page === 0 ? true : false}>
          prev
        </button>
        <ul style={styles.list}>
          {pages.map((el, index) => (
            <li
              style={{
                background: `${pState.page === index ? "green" : ""}`,
              }}
              onClick={clickHandler}
              key={index}
            >
              {el}
            </li>
          ))}
        </ul>
        <button
          onClick={clickHandler}
          disabled={page === Math.round(plength / pp) - 1 ? true : false}
        >
          next
        </button>
      </div>
    </div>
  );
};

const initialState = {
  page: 0,
  pp: 7,
  plength: 0,
};

function App() {
  const [stocks, setStocks] = useState([]);
  const [pState, dispatch] = useReducer(timeSeriesReducer, initialState);

  const [hasStocks, setHasStocks] = useState(false);

  // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo

  const clickHandler = (e) => {
    let target = e.target.textContent;
    if (target === "next") {
      dispatch({ type: "next" });
    } else if (target === "prev") {
      dispatch({ type: "prev" });
    } else {
      dispatch({ type: "setPage", payload: +target });
    }
  };

  useEffect(() => {
    async function fetcher() {
      const response = await fetch("/data.json");
      const data = await response.json();
      data && setStocks(Object.entries(data["Time Series (Daily)"]));
    }
    fetcher();

    let timer = setTimeout(() => setHasStocks(true), 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasStocks && pState.page === 0) {
      dispatch({ type: "setLength", payload: stocks.length });
    }
  }, [hasStocks]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stocks</h1>
        {stocks.length > 0 && (
          <StockList
            pState={pState}
            stocks={stocks}
            clickHandler={clickHandler}
          />
        )}
      </header>
    </div>
  );
}

export default App;
