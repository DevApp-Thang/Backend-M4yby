module.exports = {
    apps : [{
      name: "app",
      script: "./bin/www",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        SECRET_TOKEN : "W45DbGat>:(>XF4{",
        TOKEN_EXPIRE : "1h",
        SECRET_REFRESH_TOKEN : "?28FTP.Z4uxG7D26",
        REFRESH_TOKEN_EXPIRE : "30d",
        SMTP_EMAIL : "",
        SMTP_PASSWORD : "",
        FROM_NAME : "",
        FROM_EMAIL : "",
        FOLDER_DEFAULT : "./public/images"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        SECRET_TOKEN : "W45DbGat>:(>XF4{",
        TOKEN_EXPIRE : "1h",
        SECRET_REFRESH_TOKEN : "?28FTP.Z4uxG7D26",
        REFRESH_TOKEN_EXPIRE : "30d",
        SMTP_EMAIL : "",
        SMTP_PASSWORD : "",
        FROM_NAME : "",
        FROM_EMAIL : "",
        FOLDER_DEFAULT : "./public/images"
      }
    }]
  }