import Header from './header'
import Footer from './footer'

const Content = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="content-wrapper">
      <Header/>
      <main>
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default Content