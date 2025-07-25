import React, { useState } from 'react'
import { useTheme } from '../hooks/UseTheme'

export default function Header() {
  const [isDark, setIsDark] = useTheme()
  




  return (
    <header className={`header-container ${isDark? 'dark': ''}`}>
      <div className="header-content">
        <h2 className="title">
          <a href="/">Where in the world?</a>
        </h2>
        <p className="theme-changer" onClick={()=> {
          setIsDark(!isDark)
          localStorage.setItem('isDarkMode', !isDark)
        }}>
          <i className={`fa-solid fa-${isDark? 'sun': 'moon'}`} />
          &nbsp;&nbsp;{`${isDark? 'Light Mode': 'Dark Mode'}`}
        </p>
      </div>
    </header>
  )
}
