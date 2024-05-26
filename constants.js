const validator = require('validator');
const jsonwebtoken = require('jsonwebtoken')
const express = require('express');
const mongoose = require("mongoose");
const JWT_SECRET = 'SECRETKEY';
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

module.exports = {
    validator,
    jsonwebtoken,
    express,
    mongoose,
    JWT_SECRET,
    bcrypt,
    SALT_ROUNDS
}