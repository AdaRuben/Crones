const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  console.log(`Server is running on port ${PORT}`);
  if (error) {
    console.log(`Error - ${error}`);
  }
});
