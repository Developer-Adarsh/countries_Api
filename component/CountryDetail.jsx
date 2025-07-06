import React, { useEffect, useState } from 'react'
import './CountryDetail.css'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTheme } from '../hooks/UseTheme'
import CountryDetailShimmer from './CountryDetailShimmer'

export default function CountryDetail() {
  const [isDark] = useTheme()
  const params = useParams()
  const { state } = useLocation()

  const countryName = params.country

  const [countryData, setCountryData] = useState(null)
  const [notFound, setNotFound] = useState(false)

  function updateCountryData(data) {
    setCountryData({
      name: data.name.common,
      nativeName: data.name.nativeName
        ? Object.values(data.name.nativeName)[0].common
        : data.name.common,
      population: data.population.toLocaleString('en-IN'),
      region: data.region,
      subRegion: data.subregion,
      capital: data.capital?.[0] || 'N/A',
      tld: data.tld?.join(', ') || 'N/A',
      languages: data.languages
        ? Object.values(data.languages).join(', ')
        : 'N/A',
      currencies: data.currencies
        ? Object.values(data.currencies)
            .map((currency) => currency.name)
            .join(', ')
        : 'N/A',
      flag: data.flags.svg,
      borders: data.borders || [],
    })

    if (!data.borders) {
      data.borders = []
    }

    Promise.all(
      data.borders.map((border) => {
        return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => res.json())
          .then(([borderCountry]) => borderCountry.name.common)
      })
    ).then((borders) => {
      setTimeout(() =>
        setCountryData((prevState) => ({ ...prevState, borders }))
      )
    })
  }

  useEffect(() => {
    if (state) {
      updateCountryData(state)
      return
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then((res) => res.json())
      .then(([data]) => {
        // console.log(data)
        updateCountryData(data)
      })
      .catch((err) => {
        setNotFound(true)
      })
  }, [countryName])

  if (notFound) {
    return <div>Country not Found..</div>
  }

  return (
    <main className={`${isDark ? 'dark' : ''}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        {countryData === null ? (
          <CountryDetailShimmer />
        ) : (
          <div className="country-details">
            <img src={countryData.flag} alt="" />
            <div className="details-text-container">
              <h1>{countryData.name}</h1>
              <div className="details-text">
                <p>
                  <b>Native Name: </b> {countryData.nativeName}
                  <span className="native-name"></span>
                </p>
                <p>
                  <b>Population: </b> {countryData.population}
                  <span className="population"></span>
                </p>
                <p>
                  <b>Region: </b> {countryData.region}
                  <span className="region"></span>
                </p>
                <p>
                  <b>Sub Region: </b> {countryData.subRegion}
                  <span className="sub-region"></span>
                </p>
                <p>
                  <b>Capital: </b> {countryData.capital}
                  <span className="capital"></span>
                </p>
                <p>
                  <b>Top Level Domain: </b> {countryData.tld}
                  <span className="top-level-domain"></span>
                </p>
                <p>
                  <b>Currencies: </b> {countryData.currencies}
                  <span className="currencies"></span>
                </p>
                <p>
                  <b>Languages: </b> {countryData.languages}
                  <span className="languages"></span>
                </p>
              </div>
              {countryData.borders.length !== 0 && (
                <div className="border-countries">
                  <b>Border Countries: </b>&nbsp;
                  {countryData.borders.map((border) => (
                    <Link key={border} to={`/${border}`}>
                      {border}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
