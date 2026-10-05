import Banner from "./Banner"
import News from "./News"
import Recommened from "./Recommened"
import TopSellers from "./TopSellers"

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <Recommened></Recommened>
      <TopSellers></TopSellers>
      <News></News>
    </>
  )
}

export default Home
