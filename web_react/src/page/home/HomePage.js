import styles from "./HomePage.module.css";
import "./HomePage1.css";
import { useState } from "react";
import ProductCart from "../../component/cart/ProductCart";
import Ixs from "../../assests/image/10.jpg";
import I11 from "../../assests/image/11.jpg";

const dataProduct = [
  {
    id: 1,
    product_name: "Javascript XS",
    des: "Des ...",
    price: 890,
    stock: 2,
    image: require("../../assests/image-course/js.png"),
  },
  {
    id: 2,
    product_name: "MySQL 11",
    des: "Des ...",
    price: 1000,
    stock: 2,
    image: require("../../assests/image-course/mysql.png"),
  },
  {
    id: 3,
    product_name: "NestJs 13",
    des: "Des ...",
    price: 1300,
    stock: 2,
    image: require("../../assests/image-course/nestjs.png"),
  },
];
const HomePage = () => {
  const [list, setList] = useState(dataProduct);
  return (
    <div style={{ padding: 20, display: "flex", gap: 10 }}>
      {list.map((item, index) => (
        <ProductCart
          key={index}
          Id={item.id}
          ProductName={item.product_name}
          Image={item.image}
          Description={item.des}
          Price={item.price}
          Stock={item.stock}
          onClickAddCart={(value) => alert(value)}
        />
      ))}
    </div>
  );
};

export default HomePage;
