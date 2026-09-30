import Banner from "./Banner"
import News from "./News"
import Recommened from "./Recommened"
import TopSellers from "./TopSellers"

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <TopSellers></TopSellers>
      <Recommened></Recommened>
      <News></News>
    </>
  )
}

export default Home
