const envConfig = {
  //port
  port: process.env.PORT,

  //cors
  origin: process.env.CORS_ORIGIN,

  //database
  databaseURL: process.env.DB_URL,

  // cloudinary
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // tokens
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY,

  //mail
  userName: process.env.SEND_MAIL_NAME,
  password: process.env.SEND_MAIL_PASSWORD,
  
};

export default { envConfig };
