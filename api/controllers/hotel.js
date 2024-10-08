const Hotel=require("../models/Hotel")
const Room=require("../models/Room")
const createHotel=async(req,res,next)=>{
    const newHotel=new Hotel(req.body)
    try{
       const savedHotel=await newHotel.save()
       res.status(200).json(savedHotel)
    }
    catch(err){
        next(err)
    }
}

const updateHotel=async(req,res,next)=>{
    try{
       const updatedHotel=await Hotel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
       res.status(200).json(updatedHotel)
    }
    catch(err){
        next(err)
    }
}

const deleteHotel=async(req,res,next)=>{
    try{
       await Hotel.findByIdAndDelete(req.params.id)
       res.status(200).json("Hotel has been deleted")
    }
    catch(err){
        next(err)
    }
}

const getHotelById=async(req,res,next)=>{
    try{
       const hotel=await Hotel.findById(req.params.id)
       res.status(200).json(hotel)
    }
    catch(err){
        next(err)
    }
}
const getAllHotels=async(req,res,next)=>{
    try{
       const hotels=await Hotel.find()
       res.status(200).json(hotels)
    }
    catch(err){
        next(err)
    }
}

  const getHotels=async (req, res, next) => {
    try {
        const { limit, featured, min, max } = req.query;

        const query = {
            featured: featured , 
            cheapestPrice: { $gt: min || 0, $lt: max || 999 }
        };

        const hotels = await Hotel.find(query).limit(parseInt(limit));

        return res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };

  const getHotelsByCity = async (req, res, next) => {
    try {
        const {city,min,max} = req.query; 
        const query={
            city:city,
            cheapestPrice: { $gt: min || 0, $lt: max || 999 }
        }
        const hotels = await Hotel.find(query); 
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
}

const countByCity=async(req,res,next)=>{
    const cities=req.query.cities.split(",")
    try{
       const list=await Promise.all(cities.map((city)=>{
        return Hotel.countDocuments({city:city})
       }))
       res.status(200).json(list)
    }
    catch(err){
        next(err)
    }
}

const countByType=async(req,res,next)=>{
    
    try{
        const hotelCount=await Hotel.countDocuments({type:"hotel"}) 
        const apartmentCount=await Hotel.countDocuments({type:"apartment"}) 
        const resortCount=await Hotel.countDocuments({type:"resort"}) 
        const villaCount=await Hotel.countDocuments({type:"villa"}) 
        const cabinCount=await Hotel.countDocuments({type:"cabin"}) 
       res.status(200).json([
        {type:"hotel",count:hotelCount},
        {type:"apartment",count:apartmentCount},
        {type:"resort",count:resortCount},
        {type:"villa",count:villaCount},
        {type:"cabin",count:cabinCount}
       ])
    }
    catch(err){
        next(err)
    }
}

const getHotelRooms=async(req,res,next)=>{
    try{
       const hotel=await Hotel.findById(req.params.id)
       const list=await Promise.all(hotel.rooms.map((room)=>{
        return Room.findById(room)
       }))
       return res.status(200).json(list)
    }catch(err)
    {
        next(err)
    }
}

module.exports= {createHotel,updateHotel,deleteHotel,getHotelById,getHotels,countByCity,countByType,getAllHotels,getHotelsByCity,getHotelRooms}