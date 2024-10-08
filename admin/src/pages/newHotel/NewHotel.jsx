import React,{useState} from 'react'
import './newHotel.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import {CloudUpload} from "@material-ui/icons"
import axios from 'axios'
import { hotelInputs } from '../../formSource'
import UseFetch from '../../hooks/UseFetch'
const NewHotel = () => {
    const[files,setFiles]=useState("");
    const[info,setInfo]=useState({});
    const[rooms,setRooms]=useState([]);
    const{data,loading}=UseFetch("/rooms")
    const handleChange=(e)=>{
        setInfo((prev)=>({
          ...prev,[e.target.id]:e.target.value
        }))
    }
    const handleSelect=(e)=>{
        const value= Array.from(e.target.selectedOptions ,(option)=>option.value)
        setRooms(value)
       }
    const handleClick= async(e)=>{
      e.preventDefault();
      try{
         const list=await Promise.all(Object.values(files).map(async(file)=>{
            const data=new FormData();
            data.append("file",file);
            data.append("upload_preset","upload");
            const uploadRes=await axios.post("https://api.cloudinary.com/v1_1/dnsbjydfb/image/upload",data)
            //console.log(uploadRes.data)
            const {url}=uploadRes.data;
            return url;
        }))
            const newHotel={...info,rooms,photos:list}
            await axios.post("/hotels",newHotel)
            //console.log(newUser)
         
      }catch(err)
      {
        console.log(err)
      }
    }
   
    console.log(files)
  return (
    <>
      <div className="new">
        <Sidebar/>
        <div className="newContainer">
          <Navbar/>
          <div className="top">
            <h1>Add New Hotel</h1>
          </div>
          <div className="bottom">
            <div className="left">
              <img src={files ? URL.createObjectURL(files[0]) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
            </div>
            <div className="right">
              <form >
              <div className="formInput">
              <label htmlFor='file'>Image:<CloudUpload className='icon'/></label>
                <input type="file" id='file' multiple onChange={(e)=>setFiles(e.target.files)} style={{display:"none"}} />
                </div>
                {hotelInputs.map((input)=>(
                 <div className="formInput" key={input.id}>
                 <label >{input.label}</label>
                 <input type={input.type} onChange={handleChange} placeholder={input.placeholder} id={input.id}/>
               </div>
                ))}
                <div className="formInput">
                <label >Featued</label>
                <select id="featured" onChange={handleChange}>
                    <option value={false}>NO</option>
                    <option value={true}>YES</option>
                </select>
               </div>
               <div className="selectRooms">
                <label >Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                    {loading ? "loading" : data && data.map((room)=>(
                        <option key={room._id} value={room._id}>{room.title}</option>
                    ))}
                </select>
               </div>
                <button onClick={handleClick}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewHotel
