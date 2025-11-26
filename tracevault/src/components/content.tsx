import React from 'react'
import Header from './header'
import Footer from './footer'
const content = ({children}: {children: React.ReactNode}) => {

  const [hashFinal, setHashFinal] = ("");

  return (
    <div>
      <Header/>   
        {children}
      <Footer/>
      </div>
  )
}

export default content