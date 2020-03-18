import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../models/userModel';


const User = mongoose.model('User' , UserSchema );


export const register = (req , res)=>{
    console.log("helloo");
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password , 10);
    newUser.save((err , user)=>{
        if(err){
            return res.status(400).send({
                message: err
            })
        } else {
            user.hashPassword = undefined;
            res.json(user);
        }
    })
}

export const login = (req , res)=>{
    
    User.findOne({
        email:req.body.email
    } , (err , user) => { 
        if(err) throw err
        if(!user){
            res.status(401).json({message : "Authentication Failed , No User Found !"});
        } else if(user){
            if(!user.comparePassword(req.body.password , user.hashPassword)){
                res.status(401).json({message : "Authentication Failed , Wrong Password !"});
            
        } else {
            res.json({token: jwt.sign({email: user.email , userName: user.userName , _id: user.id , 
            } , 'RESTFULAPIs')});
        }
    }
    });
}

export const loginRequired = (req , res , next)=>{
    if(req.user){
        next();
    } else {
        return res.status(401).json({message: " Unauthorized User"});
    }
}