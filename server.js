const express = require('express')
const PORT = process.env.PORT || 7000;
const bodyParser = require('body-parser')

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const supplierRoutes = require('./routes/supplier')
const salesRoutes = require('./routes/sales')
const ordersRoutes = require('./routes/orders');
const errorController = require('./controllers/error')
const path = require('path')
const cookieParser = require('cookie-parser')

// BODYPARSER SHOULD ALWAYS BEFORE CALLING ROUTES COZ IT CAN'T FETCH ANYTHING FROM BODY
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes)
app.use(salesRoutes)
app.use(supplierRoutes)
app.use(ordersRoutes);
app.use(errorController.get404);

app.listen(PORT, () => {
  console.log(`Server listening at port: http://localhost:${PORT}`);
});