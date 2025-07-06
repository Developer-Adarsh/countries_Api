import { useEffect, useState } from 'react'
// import CountriesData from '../CountriesData'
import CountryCard from './CountryCard'
import CountriesListShimmer from './CountriesListShimmer'

export default function CountriesList({ query }) {
  let [CountriesData, setCountriesData] = useState([])

  useEffect(() => {
    fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,languages,currencies,population,borders,cca3'
    )
      .then((res) => res.json())
      .then((data) => {
        setCountriesData(data)
      })
  }, [])

  return (
    <>
      {!CountriesData.length ? (
        <CountriesListShimmer />
      ) : (
        <div className="countries-container">
          {CountriesData.filter((country) =>
            country.name.common.toLowerCase().includes(query) ||  country.region.toLowerCase().includes(query)
          ).map((country, i) => {
            return (
              <CountryCard
                key={i}
                name={country.name.common}
                flag={country.flags.svg}
                population={country.population}
                region={country.region}
                capital={country.capital?.[0]}
                data={country}
              />
            )
          })}
        </div>
      )}
    </>
  )
}
