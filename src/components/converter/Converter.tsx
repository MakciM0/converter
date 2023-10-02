import React, { FC, useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store/AppHooks";
import { SetCurrencies } from "../../store/ConverterSlice";
import axios from "axios";

import styles from "./Converter.module.scss";
import { TCurrency } from "../../types/types";

interface ConverterProps {}

const Converter: FC<ConverterProps> = () => {
  const dispatch = useAppDispatch();

  const currencies = useAppSelector((state) => state.converter.currencies);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openListFirst, setOpenListFirst] = useState<boolean>(false);
  const [openListSecond, setOpenListSecond] = useState<boolean>(false);

  const [currentValue, setCurrentValue] = useState<number>(1);
  const [totalValue, setTotalValue] = useState<number>(0);

  const [currentCurrenciesFirst, setCurrentCurrenciesFirst] =
    useState<TCurrency>(currencies[0]);
  const [currentCurrenciesSecond, setCurrentCurrenciesSecond] =
    useState<TCurrency>(currencies[0]);

  const base_URL = "https://api.coincap.io/v2/assets";

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(base_URL).then((response) => {
          dispatch(SetCurrencies(response.data.data));
          setIsLoading(true);
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isLoading]);

  const handleCurrentValue = (e: number) => {
    if (e > 0) {
      setCurrentValue(e);
    }
  };

  const handleFirstList = (el: TCurrency) => {
    setCurrentCurrenciesFirst(el);
    setOpenListFirst(false);
  };
  const handleSecondList = (el: TCurrency) => {
    setCurrentCurrenciesSecond(el);
    setOpenListSecond(false);
  };

  useEffect(() => {
    // Подсчёт итогового input
    let value =
      (currentValue * currentCurrenciesFirst.priceUsd) /
      currentCurrenciesSecond.priceUsd;
    value = Number(value.toFixed(6));
    setTotalValue(value);
  }, [currentValue, currentCurrenciesFirst, currentCurrenciesSecond]);

  return (
    <>
      {isLoading ? (
        <div className={styles.converter}>
          <div className={styles.currencies}>
            <span>Количество: </span>
            <input
              className={styles.current_value}
              onChange={(e) => handleCurrentValue(Number(e.target.value))}
              type="number"
            />
            <input readOnly value={currentCurrenciesFirst?.name} type="text" />
            <button onClick={() => setOpenListFirst(!openListFirst)}>
              Список валют
            </button>
            {openListFirst ? (
              <div className={styles.currencies_list}>
                {currencies.map((el) => (
                  <p onClick={() => handleFirstList(el)}>
                    {el.name + " " + el.priceUsd + "$"}
                  </p>
                ))}
              </div>
            ) : ( "" )}
          </div>

          <div className={styles.currencies}>
            <input readOnly value={currentCurrenciesSecond?.name} type="text" />
            <button onClick={() => setOpenListSecond(!openListSecond)}>
              Список валют
            </button>
            {openListSecond ? (
              <div className={styles.currencies_list}>
                {currencies.map((el) => (
                  <p onClick={() => handleSecondList(el)}>
                    {el.name + " " + el.priceUsd + "$"}
                  </p>
                ))}
              </div> ) : ( "" )}
          </div>
          <div className={styles.totalValue}>
            <input
              readOnly
              value={
                currentCurrenciesFirst.name && currentCurrenciesSecond.name
                  ? currentValue +
                    " " +
                    currentCurrenciesFirst.name +
                    " = " +
                    totalValue +
                    " " +
                    currentCurrenciesSecond.name
                  : ""
              }
              type="text"
            />
          </div>
        </div>
      ) : (
        <>loading</>
      )}
      <div className={styles.currencies_wrapper}>
        <div className={styles.currencies_info}>
          {currentCurrenciesFirst.name ? (
            <>
              <p>
                Название: {" "}
                {currentCurrenciesFirst.name +
                  " " +
                  currentCurrenciesFirst.symbol}
              </p>
              <p>Цена в $: {currentCurrenciesFirst.priceUsd}</p>
              <p className={`${currentCurrenciesFirst.changePercent24Hr > 0 ? 'changePlus' : 'changeMinus'}`}>
                Изменения за 24 часа: <span>{currentCurrenciesFirst.changePercent24Hr} %</span>
              </p>
            </>
          ) : (
            ""
          )}
        </div>
        <div className={styles.currencies_info}>
          {currentCurrenciesSecond.name ? (
            <>
              <p>
                Название:{" "}
                {currentCurrenciesSecond.name +
                  " " +
                  currentCurrenciesFirst.symbol}
              </p>
              <p>Цена в $: {currentCurrenciesSecond.priceUsd}</p>
              <p className={`${currentCurrenciesSecond.changePercent24Hr > 0 ? 'changePlus' : 'changeMinus'}`}>
                Изменения за 24 часа:{" "}
                <span>{currentCurrenciesSecond.changePercent24Hr} %</span>
              </p>
            </>
          ) : (
            ""
          )}
        </div>
        {currentCurrenciesFirst.name && currentCurrenciesSecond.name ? (
          <div className={styles.total_value_info}>
            <p>{`Цена ${currentValue}  ${currentCurrenciesFirst.name} Будет равна ${totalValue}  ${currentCurrenciesSecond.name}`}</p>
            <p>{` или ${
              currentValue * currentCurrenciesFirst.priceUsd
            }$ долларов`}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Converter;
