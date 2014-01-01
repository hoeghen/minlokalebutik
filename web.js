var express = require('express');
var app = express();
 
app.use(express.logger('dev'));
app.listen(process.env.PORT || 5000);