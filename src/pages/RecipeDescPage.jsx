import React, { useEffect, useState } from "react";
import img from "../assets/Recipe-card-img1.jpeg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/userSlice";

const RecipeDescPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isFav, setIsFav] = useState(false);
  const [desc,setDesc] = useState({})
  const {id} = useParams()
  const loadData = async ()=>{
    console.log(id)
    const res = await axios.get(`/recipe/getARecipe/${id}`)
    console.log(res)
    if(res.status === 200){
      setDesc(res?.data?.det)
    }
  }
  useEffect(()=>{
    loadData()
  },[])
  useEffect(() => {
    const favs = user.favorites;
    if (favs?.find((a) => a === desc._id) !== undefined) {
      setIsFav(true);
    }
  }, [user, desc]);
  const handleClick = async (action) => {
    if (action === "remove") {
      const res = await axios.post("/recipe/removeFav", {
        recipe_id: desc._id,
        user_id: user.id,
      });
      if (res.status === 200) {
        console.log(res);
        dispatch(updateUser({ id: desc._id, action: "remove" }));
        // window.location.reload();
      }
    }else if(action === "add"){
      console.log(user)
      const res = await axios.post("/recipe/addFav", {
        recipe_id: desc._id,
        user_id: user.id,
      });
      if (res.status === 200) {
        console.log(res);
        dispatch(updateUser({ id: desc._id, action: "add" }));
        // window.location.reload();
      }
    }
  };
  return (
    <div className="px-5 py-2 mt-[100px]">
      <div className="h-[500px] w-full relative">
        <div className="absolute top-3 right-3 flex gap-2 items-center z-[3]">
          <div
            className="bg-black/[0.6] rounded-full p-2 cursor-pointer"
            onClick={() => setIsFav(!isFav)}
          >
            {isFav ? (
            <FavoriteIcon
              className="text-white"
              onClick={() => handleClick("remove")}
            />
          ) : (
            <FavoriteBorderIcon
              className="text-white"
              onClick={() => handleClick("add")}
            />
          )}
          </div>
          <div className="bg-black/[0.6] rounded-full p-2 flex justify-center items-center cursor-pointer">
            <ShareIcon className="text-white" />
          </div>
        </div>
        <img src={img} alt="" className="w-full h-full object-cover rounded" />
        <div className="absolute left-0 top-0 bg-black/[0.6] h-full w-full flex flex-col items-start rounded justify-end px-3 pb-6">
          <p className="md:text-[50px] text-[25px] text-[white] font-bold">{desc.Name}</p>
          <p className="text-white">
            {desc.Description}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        {/* <p className="md:text-[20px] text-[12px]"> */}
        {/* <div className="flex gap-2 items-center">
          <span className="md:h-[30px] h-[20px] w-[20px] md:w-[30px] rounded-full bg-slate-400"></span>
          <p className="text-black md:text-[20px] text-[12px]">Binay Kumar Sahu</p>
        </div> */}
        {/* </p> */}
        <p className="md:text-[20px] text-[12px]">Preparation time: {desc.time}</p>
        <p className="md:text-[20px] text-[12px]">Ratings: 4.5/5</p>
      </div>
      <div>
        <h1 className="text-[30px] font-semibold">Ingridents</h1>
        <div className="grid md:grid-cols-5 grid-cols-3 gap-8 mt-6">
          {desc.Ingredients?.map((ing,idx)=>(
            <p className="border border-[#a7462c] rounded py-2 px-5 md:text-[14px] text-[10px] font-semibold bg-bg_secondary1 hover:shadow-btn_shadow text-white" key={idx}>
              {ing}
            </p>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-[30px] font-semibold">Making Procedure</h1>
        <ol className="ml-5 list-disc">
          {desc.Method?.map((m,idx)=>(
            <li key={idx}>
              {m}
            </li>

          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDescPage;
