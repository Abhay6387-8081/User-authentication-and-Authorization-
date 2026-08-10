import dotenv from "dotenv";
dotenv.config({quiet:true});

import {v2} from "cloudinary";

v2.config({
    cloud_name:"dcguyx164",
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY,
});

export default v2;