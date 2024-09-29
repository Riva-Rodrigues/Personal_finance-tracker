import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) =>{
   try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false })

       return {accessToken, refreshToken}


   } catch (error) {
       throw new ApiError(500, "Something went wrong while generating referesh and access token")
   }
}


export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received registration data:', { username, email, password });

  if ([username, email, password].some(field => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  console.log('User exists:', userExists);

  if (userExists) {
      throw new ApiError(409, "User with email or username already exists.");
  }

  const user = await User.create({ username, password, email });
  console.log('User created:', user);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  console.log('Created user without password:', createdUser);

  if (!createdUser) {
      throw new ApiError(404, "Something went wrong while registering the user.");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully!"));
});


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
  
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Ensure cookies are only sent over HTTPS in production
      sameSite: 'Strict'  // Prevent cross-site request forgery
    };
  
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
  
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    res.status(200).json({
      user: loggedInUser,
      accessToken,
      refreshToken
    });
  });
  


export const logoutUser = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
       req.user._id,
       {
           $unset: {
               refreshToken: 1 // this removes the field from document
           }
       },
       {
           new: true
       }
   )

   const options = {
       httpOnly: true,
       secure: true
   }
   console.log("logged out succesfully");
   
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})


export const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})



export const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId).select('username'); // Fetch only the username field

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ data: user });
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

  