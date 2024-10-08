import {React,useContext,useState} from "react";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/mailList/MailLi";
import { LocationOn,ArrowLeft,ArrowRight,Close } from "@material-ui/icons";
import {useLocation,useNavigate} from 'react-router-dom'
import UseFetch from "../../hooks/UseFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
const Hotel = () => {
  const navigate=useNavigate();
  const [slideNumber,setSlideNumber]=useState(0)
  const[open,setOpen]=useState(false)
  const[openModal,setOpenModal]=useState(false)
  const location=useLocation();
  const id=location.pathname.split("/")[2]
  const {data,loading ,error,reFetch}=UseFetch(`/hotels/find/${id}`)
  const{dates,options}=useContext(SearchContext)
  //console.log(dates)
  const {user}=useContext(AuthContext)
 const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const days= dayDifference(dates[0].endDate,dates[0].startDate)
  const handleOpen=(i)=>{
    setSlideNumber(i);
    setOpen(true)
  }
  const handleMove=(direction)=>{
  let newSlideNumber;
  if(direction==="l"){
     newSlideNumber=slideNumber === 0?5:slideNumber-1
  }
  else{
    newSlideNumber=slideNumber === 5?0:slideNumber+1
  }
  setSlideNumber(newSlideNumber)
  }
  const handleClick=()=>{
    if(user)
    {
     setOpenModal(true)
    }
    else
    {
    navigate("/login")
    }

  }
  return (
    <>
      <Navbar />
      <Header type="list" />
     {loading ? ("Loading"):(<> <div className="hotelContainer">
        {open && <div className="slider">
        <Close className="close" onClick={()=>setOpen(false)}/>
        <ArrowLeft className="arrow" onClick={()=>handleMove("l")}/>
        <div className="sliderWrapper">
          <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
        </div>
        <ArrowRight className="arrow"  onClick={()=>handleMove("r")}/>
        </div>}
        <div className="hotelWrapper">
          <button onClick={handleClick} className="bookNow">Reserve or Book Now!</button>
          <h1 className="hotelTitle">{data.name}</h1>
          <div className="hotelAddress">
            <LocationOn />
            <span>{data.address}</span>
          </div>
          <div className="hotelDistance">
            <span> Excellent location – {data.distance}m from center</span>
          </div>
          
            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a free airport taxi
            </span>
            <div className="hotelImages">
              {data.photos?.map((photo,i) => (
                <div className="hotelImgWrapper">
                  <img onClick={()=>handleOpen(i)} src={photo} alt="" className="hotelImg" />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">
               {data.desc}
                </p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Perfect for a {days}-night stay!</h1>
                <span>Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!</span>
                <h2> <b>${days*data.cheapestPrice*options.room}</b> ({days} nights)</h2>
                <button onClick={handleClick}>Reserve or Book Now!</button>
              </div>
            </div>
        </div>
        <MailList />
      <Footer />
      </div></>)}
      {openModal && <Reserve setOpen={setOpenModal} hotelid={id}/>}
    </>
  );
};

export default Hotel;
